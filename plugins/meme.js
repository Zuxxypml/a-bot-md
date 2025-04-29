const fetch = require("node-fetch");

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Send initial loading message
    let loadingMsg = await m.reply("🔍 Searching for the dankest meme...");

    // Fetch meme from API
    let apiUrl = "https://api.botcahx.eu.org/api/random/meme?apikey=lvxVAfDd";
    let res = await fetch(apiUrl);

    // Check if response is successful
    if (!res.ok)
      throw new Error(`API request failed with status ${res.status}`);

    // Get the image buffer
    let buffer = await res.buffer();

    // Check if buffer is valid
    if (!buffer || buffer.length === 0)
      throw new Error("Received empty image data");

    // Edit loading message to indicate success
    await loadingMsg.edit("✅ Found a spicy meme!");

    // Send the meme with caption
    await conn.sendFile(
      m.chat,
      buffer,
      "meme.jpg",
      `😂 Here's your meme!\n` +
        `📛 *Caption:* ${res.caption || "No caption"}\n` +
        `🆔 *Post ID:* ${res.id || "Unknown"}\n` +
        `👍 *Upvotes:* ${res.upvotes || "N/A"}`,
      m,
      false,
      {
        thumbnail: Buffer.alloc(0),
        quoted: m,
      }
    );
  } catch (error) {
    console.error("Meme command error:", error);
    m.reply("❌ Failed to fetch meme. Please try again later!");

    // Optionally send a fallback meme
    try {
      await conn.sendFile(
        m.chat,
        "https://i.imgur.com/8Km9tLL.jpg",
        "fallback-meme.jpg",
        "Here's a fallback meme since we couldn't fetch a fresh one!",
        m
      );
    } catch (fallbackError) {
      console.error("Fallback meme failed:", fallbackError);
    }
  }
};

// Command info
handler.help = ["meme"];
handler.tags = ["fun", "image"];
handler.command = /^meme$/i;

// Rate limiting
handler.limit = true;
handler.premium = false;
handler.register = true;

module.exports = handler;
