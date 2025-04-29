const fetch = require("node-fetch");
const uploadImage = require("../lib/uploadImage.js");
const { spawn } = require("child_process");

let handler = async (m, { conn, usedPrefix, command }) => {
  // Check for quoted message or image attachment
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime)
    throw `Please send/reply to an image with caption *${usedPrefix}${command}*`;
  if (!mime.startsWith("image")) throw "Only image files are supported!";

  try {
    m.reply("⏳ Processing your image... Please wait");

    // Download and upload image
    let media = await q.download();
    let url = await uploadImage(media);

    // Enhanced API call with error handling
    let apiUrl = `https://api.lolhuman.xyz/api/imagetoanime?apikey=d5d9e369ab0bf0c231d43b17&img=${url}`;
    let response = await fetch(apiUrl);

    if (!response.ok) throw "Failed to process image. API might be down.";

    // Get result and send
    let result = await response.buffer();
    await conn.sendFile(
      m.chat,
      result,
      "anime.jpg",
      `🎨 *Image to Anime Conversion* 🎨\n\nHere's your anime-style image!\nNote: Results may vary depending on the original image quality.`,
      m
    );

    // Optional: Clean up temp files
    try {
      spawn("rm", [media]);
    } catch (e) {
      console.log("Cleanup error:", e);
    }
  } catch (error) {
    console.error("Conversion error:", error);
    m.reply(
      "❌ Failed to convert image. Please try again with a clearer image."
    );
  }
};

handler.help = ["toanime", "animefy", "animefilter"];
handler.tags = ["anime", "premium", "tools"];
handler.command = /^(toanime|jadianime|animefy|animefilter)$/i;
handler.premium = true;
handler.limit = true;

module.exports = handler;
