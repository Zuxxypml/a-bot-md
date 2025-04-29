const axios = require("axios");
const path = require("path");

const handler = async (m, { conn, text }) => {
  if (!text)
    return m.reply(`Please provide a URL starting with http:// or https://`);

  // Validate URL format
  if (!/^https?:\/\//i.test(text)) {
    return m.reply("Invalid URL format. Please include http:// or https://");
  }

  try {
    // Fetch data from URL with security headers
    const response = await axios.get(text, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.google.com/",
        Connection: "keep-alive",
      },
      responseType: "arraybuffer",
      timeout: 10000, // 10 second timeout
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const contentType = response.headers["content-type"] || "";
    const ext = path.extname(text).toLowerCase();
    const contentLength = parseInt(response.headers["content-length"]) || 0;

    // Check for reasonable file size (10MB max)
    if (contentLength > 10 * 1024 * 1024) {
      return m.reply("File size exceeds 10MB limit");
    }

    // Process content based on type
    if (/application\/json/i.test(contentType)) {
      const jsonData = JSON.parse(response.data.toString("utf8"));
      return m.reply(JSON.stringify(jsonData, null, 2));
    } else if (/text\//i.test(contentType)) {
      return m.reply(response.data.toString("utf8"));
    } else if (/image\/webp/i.test(contentType) || ext === ".webp") {
      return conn.sendMessage(
        m.chat,
        {
          sticker: { url: text },
          contextInfo: {
            externalAdReply: {
              title: "WebP Sticker",
              body: "Converted from URL",
              thumbnailUrl: text,
            },
          },
        },
        { quoted: m }
      );
    } else if (/image\//i.test(contentType)) {
      return conn.sendMessage(
        m.chat,
        {
          image: { url: text },
          caption: `Image from URL`,
        },
        { quoted: m }
      );
    } else if (/video\//i.test(contentType)) {
      return conn.sendMessage(
        m.chat,
        {
          video: { url: text },
          caption: `Video from URL`,
        },
        { quoted: m }
      );
    } else if (
      /audio\//i.test(contentType) ||
      [".mp3", ".ogg", ".wav"].includes(ext)
    ) {
      return conn.sendMessage(
        m.chat,
        {
          audio: { url: text },
          mimetype: "audio/mpeg",
          ptt: false,
        },
        { quoted: m }
      );
    } else {
      // Generic file handler
      const fileName = path.basename(text.split("?")[0]); // Remove query params
      return conn.sendMessage(
        m.chat,
        {
          document: { url: text },
          fileName: fileName || "file",
          mimetype: contentType,
          caption: `File from URL`,
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error("URL Fetch Error:", error);

    if (error.response) {
      return m.reply(`Server responded with status ${error.response.status}`);
    } else if (error.request) {
      return m.reply("No response received from server");
    } else {
      return m.reply(`Error: ${error.message}`);
    }
  }
};

handler.help = ["get <url>"];
handler.command = /^(get|fetch)$/i;
handler.tags = ["tools"];
handler.limit = true;
handler.premium = false;

module.exports = handler;
