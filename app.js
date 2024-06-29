const chatMessages = document.querySelector(".chat-messages");
const chatInput = document.querySelector(".chat-input input");
const chatButton = document.querySelector(".chat-input button");

chatButton.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = chatInput.value.trim();
  displayMessage(message, "user");

  // Clear input field
  chatInput.value = "";

  if (message !== "") {
    // Send message to server
    const response = await fetch("http://localhost:8008/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    // Display response from server
    const data = await response.json();
    const botData = JSON.parse(data.bot);

    if (botData.response_type === "general") {
      displayMessage(botData.message, "bot");
    } else if (botData.response_type === "house_prices") {
      displayHousePrices(botData.houses);
    } else if (botData.response_type === "travel_suggestions") {
      displayTravelSuggestions(botData.locations);
    } else if (botData.response_type === "area_recommendations") {
      displayAreaRecommendations(botData.areas);
    } else {
      displayMessage(data.bot, "bot");
    }
  }
}

function displayHousePrices(houses) {
  let message = "House Prices:\n";
  houses.forEach((house) => {
    message += `- ${house.name}\n`;
    message += `  Price: ${house.price}\n`;
    message += `  Location: ${house.location}\n\n`;
  });
  displayMessage(message, "bot");
}

function displayTravelSuggestions(locations) {
  let message = "Travel Suggestions:\n";
  locations.forEach((location) => {
    message += `- ${location.name}\n`;
    message += `  Interest: ${location.interest}\n`;
    message += `  Price: ${location.price}\n`;
    message += `  Availability: ${location.availability}\n`;
    message += `  <img src="${location.image_url}" alt="${location.name}" />\n\n`;
  });
  displayMessage(message, "bot");
}

function displayAreaRecommendations(areas) {
  let message = "Area Recommendations:\n";
  areas.forEach((area) => {
    message += `- ${area.name}\n`;
    message += `  Price: ${area.price}\n`;
    message += `  Availability: ${area.availability}\n`;
    message += `  <img src="${area.image_url}" alt="${area.name}" />\n\n`;
  });
  displayMessage(message, "bot");
}

function displayMessage(message, sender) {
  const messageElement = document.createElement("p");
  messageElement.classList.add("chat-message");
  messageElement.classList.add(
    sender === "bot" ? "bot-message" : "user-message"
  );
  messageElement.innerHTML = message;
  chatMessages.appendChild(messageElement);

  // Scroll to bottom of messages
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
    mobileTop.className += " opened";
    mobileBtm.className += " opened";
    mobileMenu.style.margin = "0";
    body.style.overflow = "hidden";
  } else {
    mobileTop.className = "top";
    mobileBtm.className = "bottom";
    mobileMenu.style.margin = "-460px 0 0 0";
    body.style.overflow = "scroll";
    body.style.overflowX = "hidden";
  }
}
