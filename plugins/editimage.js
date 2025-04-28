const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text)
    return m.reply("Where is the prompt? 🤨 What do you want me to edit?");

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime)
    return m.reply(
      `Send or reply to an image with the caption *${
        usedPrefix + command
      }* followed by your instructions.`
    );
  if (!/image\/(jpe?g|png)/.test(mime))
    return m.reply(
      `Unsupported format ${mime}! Only jpeg/jpg/png are allowed.`
    );

  let promptText = text;

  m.reply("_Processing your request, please wait..._");

  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI(
      "AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc"
    );

    const base64Image = imgData.toString("base64");

    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image,
        },
      },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });

    const response = await model.generateContent(contents);

    let resultImage;
    let resultText = "";

    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }

    if (resultImage) {
      const tempPath = path.join(
        process.cwd(),
        "tmp",
        `gemini_${Date.now()}.png`
      );
      fs.writeFileSync(tempPath, resultImage);

      await conn.sendMessage(
        m.chat,
        {
          image: { url: tempPath },
          caption: `*Here’s your edited image!* 🎨`,
        },
        { quoted: m }
      );

      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }, 30000);
    } else {
      m.reply(
        "Your prompt didn’t generate anything clear... please try again!"
      );
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error occurred: ${error.message}`);
  }
};

handler.help = ["aiedit", "editimage"];
handler.tags = ["ai"];
handler.command = ["aiedit", "editimage"];

module.exports = handler;
