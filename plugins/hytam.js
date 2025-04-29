const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  // Validate input
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || "";

  if (!mime) {
    const example = `${usedPrefix + command} [prompt]`;
    return m.reply(`Please send/reply to an image with caption *${example}*`);
  }

  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(
      `❌ Unsupported format: ${mime}\nOnly JPEG/JPG/PNG are supported`
    );
  }

  // Set default prompt if none provided
  const defaultPrompt =
    "Modify the character's skin tone to be darker while keeping hair and clothing colors unchanged";
  const promptText = text || defaultPrompt;

  try {
    // Show processing message
    const processingMsg = await m.reply(
      "🔄 Processing image... This may take 10-30 seconds"
    );

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc"
    );
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        responseMimeType: "image/png",
        temperature: 0.5,
      },
    });

    // Prepare image data
    const imgData = await q.download();
    const imagePart = {
      inlineData: {
        data: imgData.toString("base64"),
        mimeType: mime,
      },
    };

    // Generate content
    const result = await model.generateContent([promptText, imagePart]);
    const response = await result.response;

    // Handle response
    if (!response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      throw new Error("No image data received from API");
    }

    const resultImage = Buffer.from(
      response.candidates[0].content.parts[0].inlineData.data,
      "base64"
    );
    const tempPath = path.join(tmpdir(), `modified_${Date.now()}.png`);

    fs.writeFileSync(tempPath, resultImage);

    // Send result
    await conn.sendMessage(
      m.chat,
      {
        image: { url: tempPath },
        caption:
          "✅ Image modification complete!\n" +
          `📝 Prompt: ${promptText}\n` +
          "⚙️ Powered by Gemini AI",
      },
      { quoted: m }
    );

    // Clean up
    fs.unlinkSync(tempPath);
    await conn.sendMessage(m.chat, { delete: processingMsg.key });
  } catch (error) {
    console.error("Modification Error:", error);

    let errorMessage = "⚠️ Failed to process image\n";
    if (error.message.includes("SAFETY")) {
      errorMessage += "The content was blocked for safety reasons";
    } else if (error.message.includes("invalid")) {
      errorMessage += "Invalid image format or content";
    } else {
      errorMessage += error.message;
    }

    m.reply(errorMessage);
  }
};

// Command configuration
handler.help = ["darkskin <prompt> - Modify skin tone in images"];
handler.tags = ["ai", "image"];
handler.command = /^(darkskin|skinmod|hytam)$/i;
handler.limit = true;

module.exports = handler;
