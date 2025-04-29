// Function to dynamically import Gemini from ESM module
const loadGemini = async () => {
  const { Gemini } = await import("gemini-g4f"); // Using dynamic import
  return new Gemini(""); // Initialize with empty API key
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Check if prompt is provided
  if (!text) {
    return m.reply(
      `Please enter your prompt!\n\nExample: *${
        usedPrefix + command
      } are you gpt4?*`,
      m
    );
  }

  try {
    // Load Gemini using dynamic import
    const gemini = await loadGemini();

    // Get response from Gemini
    let res = await gemini.ask(text, {
      model: "gemini-1.5-pro-latest", // Using latest model
    });

    // Send response
    conn.reply(m.chat, res, m);
  } catch (error) {
    console.error("Gemini error:", error);
    m.reply(
      "Sorry, there was an error processing your request. Please try again later."
    );
  }
};

// Command configuration
handler.command = /^(gemini2)$/i;
handler.help = ["gemini2 <prompt> - Get response from Gemini AI"];
handler.tags = ["ai"];
handler.limit = true;

// Export handler using CommonJS
module.exports = handler;
