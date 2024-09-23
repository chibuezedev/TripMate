import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

dotenv.config();

const HOST = process.env.HOST || 8008;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello, welcome to Travel Assistant",
  });
});

// Function to fetch image from Unsplash based on keyword
async function fetchImageUrl(keyword) {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query: keyword, per_page: 1 },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (
      response.data.results &&
      response.data.results.length > 0 &&
      response.data.results[0].urls &&
      response.data.results[0].urls.small
    ) {
      return response.data.results[0].urls.small;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.message;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`
      Consider yourself as a travel assistant. The assistant is helpful, creative, clever, and very friendly. The assistant is very good at helping people. You can answer general questions, provide house prices based on the user's budget, suggest travel locations based on user interests, and recommend areas with pictures, prices, and availability. You should respond in JSON format when providing structured data.

      **Important:** When providing image URLs, use images from reliable and accessible sources such as [Unsplash](https://unsplash.com), [Pexels](https://www.pexels.com), or your own hosted image repository. **Do not** use URLs from Wikipedia or any source that may restrict hotlinking.

      Example Response Format:
      {
        "response_type": "general",
        "message": "General conversational message"
      }
      {
        "response_type": "house_prices",
        "houses": [
          {
            "name": "House Name",
            "price": "Average Price of the trip!",
            "location": "Location"
          },
        ]
      }
      {
        "response_type": "travel_suggestions",
        "locations": [
          {
            "name": "Location Name",
            "interest": "Interest",
            "image_url": "URL to Image from Unsplash or Pexels",
            "price": "Average Price of the trip In dollar!",
            "availability": "Availability"
          },
        ]
      }
      {
        "response_type": "area_recommendations",
        "areas": [
          {
            "name": "Area Name",
            "price": "Average Price of the trip In dollar!",
            "availability": "Availability",
            "image_url": "URL to Image from Unsplash or Pexels"
          },
        ]
      }

      Assistant: "Hello, welcome to Travel Assistant. How may I assist you in your travel or other queries today?"

      Human: ${prompt}

      Assistant:
    `);

    const response = await result.response;
    let generatedText = response.text();

    // Parse the generated JSON
    let botData;
    try {
      botData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Handle as a general message if JSON parsing fails
      res.status(200).send({
        bot: generatedText,
      });
      return;
    }

    // If response contains image URLs from specified sources, proceed
    // Else, fetch images from Unsplash based on the location or area name

    if (
      botData.response_type === "travel_suggestions" ||
      botData.response_type === "area_recommendations"
    ) {
      const items = botData.locations || botData.areas;

      for (let item of items) {
        if (item.name) {
          const imageUrl = await fetchImageUrl(item.name);
          if (imageUrl) {
            item.image_url = imageUrl;
          } else {
            // Fallback image if Unsplash doesn't return any
            item.image_url = "https://via.placeholder.com/150";
          }
        }
      }
    }

    res.status(200).send({
      bot: botData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(HOST, () =>
  console.log(`AI server started on http://localhost:${HOST}`)
);
