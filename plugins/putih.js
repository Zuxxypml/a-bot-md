const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Determine the message or quoted image
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  // Default prompt if none provided
  const defaultPrompt =
    "Change the character’s skin color to white, without altering hair or clothing.";

  // Ensure an image is provided
  if (!mime) {
    return m.reply(
      `📸 Please send or reply to an image with caption *${
        usedPrefix + command
      }*`
    );
  }
  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(
      `❌ Unsupported format: *${mime}*. Only JPEG or PNG allowed.`
    );
  }

  // Use provided text or fallback
  let promptText = text || defaultPrompt;
  m.reply("🧪 Processing your request, please wait...");

  try {
    // Download the image and encode to Base64
    const imgData = await q.download();
    const base64Image = imgData.toString("base64");

    // Initialize Gemini model
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE"
    );
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: { responseModalities: ["Text", "Image"] },
    });

    // Prepare the request contents
    const contents = [
      { text: promptText },
      { inlineData: { mimeType: mime, data: base64Image } },
    ];

    // Generate the transformed image
    const response = await model.generateContent(contents);
    let resultImage = null;

    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
      }
    }

    // If image returned, save and send it
    if (resultImage) {
      const tmpDir = path.join(process.cwd(), "tmp");
      fs.mkdirSync(tmpDir, { recursive: true });
      const tempPath = path.join(tmpDir, `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);

      await conn.sendMessage(
        m.chat,
        {
          image: { url: tempPath },
          caption: "✅ *Image transformation complete!*",
        },
        { quoted: m }
      );

      // Clean up after 30 seconds
      setTimeout(() => {
        fs.unlinkSync(tempPath);
      }, 30000);
    } else {
      m.reply("❌ Failed to generate transformed image.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`⚠️ Error: ${error.message}`);
  }
};

handler.help = ["putih [optional prompt]"];
handler.tags = ["ai"];
handler.command = ["putih", "putyh"];

module.exports = handler;
