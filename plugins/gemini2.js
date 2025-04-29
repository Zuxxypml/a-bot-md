const { UguuSe } = require("../lib/uploadImage");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini models
const genAI = new GoogleGenerativeAI("AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc");
const geminiProModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const geminiFlashModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Get input text from args or quoted message
  let text;
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return m.reply(`• *Example:* ${usedPrefix}gemini good morning`);
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  try {
    if (!mime) {
      // Text-only processing
      const result = await geminiFlashModel.generateContent(text);
      const response = result.response.text();

      if (!response) throw new Error("Invalid API response");

      await conn.sendMessage(
        m.chat,
        {
          text: response,
          contextInfo: {
            externalAdReply: {
              title: "GEMINI-PRO / FLASH",
              thumbnailUrl: "https://telegra.ph/file/4bae3d5130aabcbe94588.jpg",
              sourceUrl: "https://gemini.google.com",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    } else {
      // Image processing
      if (!/image\/(png|jpe?g)/.test(mime)) {
        return m.reply("Please send a valid image (JPEG/PNG)");
      }

      let media = await q.download();
      let link = await UguuSe(media);

      const imageResp = await fetch(link.url).then((response) =>
        response.arrayBuffer()
      );
      const imageBase64 = Buffer.from(imageResp).toString("base64");

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mime || "image/jpeg",
        },
      };

      const result = await geminiProModel.generateContent([imagePart, text]);
      const response = result.response.text();

      if (!response) throw new Error("Invalid API response");

      await conn.sendMessage(
        m.chat,
        {
          text: response,
          contextInfo: {
            externalAdReply: {
              title: "GEMINI-PRO / VISION",
              thumbnailUrl: link.url,
              sourceUrl: "https://gemini.google.com",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    }
  } catch (e) {
    console.error("Gemini Error:", e);
    m.reply(
      "An error occurred while processing your request. Please try again later."
    );
  }
};

// Command configuration
handler.help = ["gemini <text> - Get response from Gemini AI (text or image)"];
handler.tags = ["ai"];
handler.command = /^(gemini)$/i;
handler.limit = true;
handler.register = true;

module.exports = handler;
