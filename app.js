const chatMessages = document.querySelector(".chat-messages");
const chatInput = document.querySelector(".chat-input input");
const chatButton = document.querySelector(".chat-input button");

// Variable to hold the typing indicator element
let typingIndicator = null;

// Allow sending message with Enter key
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

chatButton.addEventListener("click", sendMessage);

// Function to show typing indicator
function showTypingIndicator() {
  // Avoid adding multiple typing indicators
  if (typingIndicator) return;

  typingIndicator = document.createElement("div");
  typingIndicator.classList.add(
    "chat-message",
    "bot-message",
    "typing-indicator"
  );
  typingIndicator.innerHTML = `
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();
}

// Function to hide typing indicator
function hideTypingIndicator() {
  if (typingIndicator) {
    chatMessages.removeChild(typingIndicator);
    typingIndicator = null;
  }
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (message === "") return;

  displayMessage(message, "user");

  // Clear input field
  chatInput.value = "";

  if (message !== "") {
    // Show typing indicator
    showTypingIndicator();

    try {
      // Send message to server
      const response = await fetch("http://localhost:8008/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Parse JSON response
      const data = await response.json();
      console.log("Server Response:", data);
      const botResponse = data.bot;

      // Parse botResponse as JSON
      let botData;
      try {
        botData =
          typeof botResponse === "string"
            ? JSON.parse(botResponse)
            : botResponse;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        botData = { response_type: "general", message: botResponse };
      }

      // Remove typing indicator before displaying the message
      hideTypingIndicator();

      // Handle different response types
      switch (botData.response_type) {
        case "general":
          displayMessage(botData.message, "bot");
          break;
        case "house_prices":
          displayHousePrices(botData.houses);
          break;
        case "travel_suggestions":
          displayTravelSuggestions(botData.locations);
          break;
        case "area_recommendations":
          displayAreaRecommendations(botData.areas);
          break;
        default:
          displayMessage(botResponse, "bot");
      }
    } catch (error) {
      console.error("Error:", error);
      hideTypingIndicator();
      displayMessage(
        "Sorry, there was an error processing your request.",
        "bot"
      );
    }
  }
}

function displayHousePrices(houses) {
  const container = createMessageContainer("bot");

  const title = document.createElement("h3");
  title.textContent = "House Prices:";
  container.appendChild(title);

  houses.forEach((house) => {
    const houseDiv = document.createElement("div");
    houseDiv.classList.add("house-item");

    const name = document.createElement("p");
    name.innerHTML = `<strong>${house.name}</strong>`;
    houseDiv.appendChild(name);

    const price = document.createElement("p");
    price.textContent = `Price: ${house.price}`;
    houseDiv.appendChild(price);

    const location = document.createElement("p");
    location.textContent = `Location: ${house.location}`;
    houseDiv.appendChild(location);

    container.appendChild(houseDiv);
  });

  chatMessages.appendChild(container);
  scrollToBottom();
}

function displayTravelSuggestions(locations) {
  const container = createMessageContainer("bot");

  const title = document.createElement("h3");
  title.textContent = "Travel Suggestions:";
  container.appendChild(title);

  locations.forEach((location) => {
    const locationDiv = document.createElement("div");
    locationDiv.classList.add("location-item");

    const name = document.createElement("h4");
    name.textContent = location.name;
    locationDiv.appendChild(name);

    const interest = document.createElement("p");
    interest.textContent = `Interest: ${location.interest}`;
    locationDiv.appendChild(interest);

    const price = document.createElement("p");
    price.textContent = `Price: ${location.price}`;
    locationDiv.appendChild(price);

    const availability = document.createElement("p");
    availability.textContent = `Availability: ${location.availability}`;
    locationDiv.appendChild(availability);

    if (location.image_url) {
      const image = document.createElement("img");
      image.src = location.image_url;
      image.alt = location.name;
      image.classList.add("location-image");

      // Debugging: Log image creation
      console.log(`Creating image for ${location.name}: ${location.image_url}`);

      // Add load and error event listeners for debugging
      image.addEventListener("load", () => {
        console.log(`Image loaded: ${location.image_url}`);
      });
      image.addEventListener("error", () => {
        console.error(`Failed to load image: ${location.image_url}`);
      });

      locationDiv.appendChild(image);
    }

    container.appendChild(locationDiv);
  });

  chatMessages.appendChild(container);
  scrollToBottom();
}

function displayAreaRecommendations(areas) {
  const container = createMessageContainer("bot");

  const title = document.createElement("h3");
  title.textContent = "Area Recommendations:";
  container.appendChild(title);

  areas.forEach((area) => {
    const areaDiv = document.createElement("div");
    areaDiv.classList.add("area-item");

    const name = document.createElement("h4");
    name.textContent = area.name;
    areaDiv.appendChild(name);

    const price = document.createElement("p");
    price.textContent = `Price: ${area.price}`;
    areaDiv.appendChild(price);

    const availability = document.createElement("p");
    availability.textContent = `Availability: ${area.availability}`;
    areaDiv.appendChild(availability);

    if (area.image_url) {
      const image = document.createElement("img");
      image.src = area.image_url;
      image.alt = area.name;
      image.classList.add("area-image");

      // Debugging: Log image creation
      console.log(`Creating image for ${area.name}: ${area.image_url}`);

      // Add load and error event listeners for debugging
      image.addEventListener("load", () => {
        console.log(`Image loaded: ${area.image_url}`);
      });
      image.addEventListener("error", () => {
        console.error(`Failed to load image: ${area.image_url}`);
      });

      areaDiv.appendChild(image);
    }

    container.appendChild(areaDiv);
  });

  chatMessages.appendChild(container);
  scrollToBottom();
}

function displayMessage(message, sender) {
  const container = createMessageContainer(sender);
  container.textContent = message;
  chatMessages.appendChild(container);
  scrollToBottom();
}

function createMessageContainer(sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", `${sender}-message`);
  return messageElement;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Home section

let opened = false;
const mobileBurger = document.querySelector("#mobile-burger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileTop = document.querySelector("#mobile-burger .mobile-burger .top");
const mobileBtm = document.querySelector(
  "#mobile-burger .mobile-burger .bottom"
);
const body = document.querySelector("body");

mobileBurger.addEventListener("click", showMenu);

function showMenu(e) {
  e.preventDefault();
  opened = !opened;

  if (opened) {
    mobileTop.classList.add("opened");
    mobileBtm.classList.add("opened");
    mobileMenu.style.margin = "0";
    body.style.overflow = "hidden";
  } else {
    mobileTop.classList.remove("opened");
    mobileBtm.classList.remove("opened");
    mobileMenu.style.margin = "-460px 0 0 0";
    body.style.overflow = "auto";
    body.style.overflowX = "hidden";
  }
}
