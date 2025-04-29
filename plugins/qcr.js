const { sticker } = require("../lib/sticker.js");
const axios = require("axios");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Determine the target message (quoted or current)
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  // Usage prompt with available colors
  const usage = `*Example:* ${usedPrefix + command} blue,Hello world!

*Available Colors:*
• pink
• blue
• red
• green
• yellow
• purple
• navy
• lightblue
• gray
• orange
• black
• white
• teal
• hotpink
• brown
• salmon
• magenta
• tan
• wheat
• deeppink
• firebrick
• skyblue
• coral
• dodgerblue
• lightskyblue
• seagreen
• darkred
• orangered
• cyan
• darkorchid
• limegreen
• darkgreen
• midnightblue
• darkorange
• darkviolet
• fuchsia
• darkmagenta
• dimgray
• peachpuff
• darkkhaki
• crimson
• goldenrod
• silver`;

  if (!text) return m.reply(usage);
  if (text.length > 80) return m.reply("❗ Maximum 80 characters allowed.");

  // Split into color and message
  let [colorName, messageText] = text.split(",");
  messageText = (messageText || colorName).trim();
  colorName = colorName.trim().toLowerCase();

  // Load user's profile picture or fallback
  let pp = await conn
    .profilePictureUrl(m.sender, "image")
    .catch(() => "https://telegra.ph/file/aa4bf541b17a95f138230.jpg");

  // Map of English color names to hex codes
  const colorMap = {
    pink: "#FFC0CB",
    blue: "#0000FF",
    red: "#FF0000",
    green: "#008000",
    yellow: "#FFFF00",
    purple: "#800080",
    navy: "#000080",
    lightblue: "#ADD8E6",
    gray: "#808080",
    orange: "#FFA500",
    black: "#000000",
    white: "#FFFFFF",
    teal: "#008080",
    hotpink: "#FF69B4",
    brown: "#A52A2A",
    salmon: "#FA8072",
    magenta: "#FF00FF",
    tan: "#D2B48C",
    wheat: "#F5DEB3",
    deeppink: "#FF1493",
    firebrick: "#B22222",
    skyblue: "#87CEEB",
    coral: "#FF7F50",
    dodgerblue: "#1E90FF",
    lightskyblue: "#87CEFA",
    seagreen: "#2E8B57",
    darkred: "#8B0000",
    orangered: "#FF4500",
    cyan: "#00FFFF",
    darkorchid: "#9932CC",
    limegreen: "#32CD32",
    darkgreen: "#006400",
    midnightblue: "#191970",
    darkorange: "#FF8C00",
    darkviolet: "#9400D3",
    fuchsia: "#FF00FF",
    darkmagenta: "#8B008B",
    dimgray: "#696969",
    peachpuff: "#FFDAB9",
    darkkhaki: "#BDB76B",
    crimson: "#DC143C",
    goldenrod: "#DAA520",
    silver: "#C0C0C0",
  };

  let backgroundColor = colorMap[colorName];
  if (!backgroundColor) return m.reply(`❌ Color not available.\n\n${usage}`);

  // React with a processing indicator
  conn.sendMessage(m.chat, {
    react: { text: "🕛", key: m.key },
  });

  // Build the quote payload
  const quotePayload = {
    type: "quote",
    format: "png",
    backgroundColor,
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: m.pushName || m.sender,
          photo: { url: pp },
        },
        text: messageText,
        replyMessage: {},
      },
    ],
  };

  try {
    // Generate the quote image
    const response = await axios.post(
      "https://quote.btch.bz/generate",
      quotePayload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const imageBuffer = Buffer.from(response.data.result.image, "base64");

    // Convert to sticker
    const s = await sticker(imageBuffer, false, global.packname, global.author);
    if (s) {
      return conn.sendFile(m.chat, s, "quote.webp", "", m);
    }
  } catch (error) {
    console.error(error);
    throw `❌ Failed to generate sticker:\n${error.message}`;
  }
};

handler.help = ["qcs <color>,<text>"];
handler.tags = ["sticker"];
handler.command = /^(qcs|quoteds|quotlys)$/i;
handler.limit = true;

module.exports = handler;
