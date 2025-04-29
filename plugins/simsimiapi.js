const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

/**
 * Ask SimSimi for a reply.
 * @param {string} text The user’s message.
 * @param {string} languageCode The language code (default 'id' for Indonesian).
 * @returns {Promise<string>} The chatbot’s reply.
 */
async function simSimi(text, languageCode = "id") {
  const url = "https://api.simsimi.vn/v1/simtalk";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/91.0.4472.124 Safari/537.36",
  };

  const data = new URLSearchParams();
  data.append("text", text);
  data.append("lc", languageCode);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: data.toString(),
    });
    const raw = await response.text();

    try {
      const json = JSON.parse(raw);
      return json.message || "Sorry, I didn't understand that.";
    } catch {
      console.error("Non-JSON response:", raw);
      return "Sorry, there was an error processing the response.";
    }
  } catch (err) {
    console.error("Error contacting SimSimi:", err);
    return "Sorry, I could not reach SimSimi.";
  }
}

let handler = async (m, { text }) => {
  // Prompt the user if no message was provided
  if (!text) {
    return m.reply("❗ Please type a message for SimSimi to reply to.");
  }

  // You can change the language code to 'en' for English, etc.
  const language = "id";
  const reply = await simSimi(text, language);
  m.reply(reply);
};

handler.help = ["simi <message>"];
handler.tags = ["fun", "ai"];
handler.command = /^((sim)?simi|simih)$/i;

module.exports = handler;
