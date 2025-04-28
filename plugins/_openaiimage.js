const axios = require("axios");

let handler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    if (!text) {
      return m.reply(
        `Generate an image with AI.\n\nExample:\n${usedPrefix}${command} a futuristic city at sunset`
      );
    }

    conn.reply(m.chat, "_*Please wait while the image is being generated...*_");

    const response = await axios.get(
      "https://widipe.com/dalle?text=" + encodeURIComponent(text),
      { responseType: "arraybuffer" }
    );
    const data = response.data;

    return conn.sendFile(m.chat, data, "", `Result for prompt: ${text}`, m);
  } catch (error) {
    console.error(error);
    m.reply("Sorry, something went wrong: " + error);
  }
};

handler.help = ["dalle"];
handler.tags = ["tools", "ai"];
handler.limit = true;
handler.exp = 0;
handler.command = /^(dalle)$/i;

module.exports = handler;
