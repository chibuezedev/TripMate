import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello, welcome to Travel Assistant",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.message;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Consider yourself as a travel assistant. The assistant is helpful, creative, clever, and very friendly. The assistant is very good at helping people. You can answer general questions, provide house prices based on the user's budget, suggest travel locations based on user interests, and recommend areas with pictures, prices, and availability. You should respond in JSON format when providing structured data.
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
                  "price": "Price",
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
                  "image_url": "URL to Image",
                  "price": "Price",
                  "availability": "Availability"
                },
              ]
            }
            {
              "response_type": "area_recommendations",
              "areas": [
                {
                  "name": "Area Name",
                  "price": "Price",
                  "availability": "Availability",
                  "image_url": "URL to Image"
                },
              ]
            }

            Assistant: "Hello, welcome to Travel Assistant. How may I assist you in your travel or other queries today?"
            Human: ${prompt}
            Assistant:`,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(8008, () =>
  console.log("AI server started on http://localhost:8008")
);
