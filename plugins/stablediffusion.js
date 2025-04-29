// Import the 'node-fetch' library to make HTTP requests
const fetch = require("node-fetch");

// Define an asynchronous handler function that takes a message object and destructures 'text' from the second argument
let handler = async (m, { text }) => {
  // If no text is provided, reply with an example usage
  if (!text) return conn.reply(m.chat, "*Example*: .stablediffusion a girl", m);

  // Show a waiting reaction (hourglass emoji) to indicate processing
  conn.sendMessage(m.chat, {
    react: {
      text: "🕒",
      key: m.key,
    },
  });

  // Construct the API URL with the encoded user's text input
  let url = `https://aemt.me/v5/text2img?text=${encodeURIComponent(text)}`;

  // Fetch the image from the API and convert it to base64 format
  let image = (await (await fetch(url)).buffer()).toString("base64");

  // Send the generated image back to the chat
  conn.sendFile(
    m.chat,
    `data:image/jpeg;base64,${image}`,
    "freefire.jpg",
    "",
    m
  );
};

// Define help text for the command
handler.help = ["stablediffusion <text>"];

// Add tags for categorization
handler.tags = ["ai"];

// Define the command pattern (case insensitive)
handler.command = /^(stablediffusion)$/i;

// Mark that this handler should be registered
handler.register = true;

// Enable rate limiting for this command
handler.limit = true;

// Export the handler for use in other modules
module.exports = handler;
