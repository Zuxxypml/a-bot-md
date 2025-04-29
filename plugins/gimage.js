const fetch = require("node-fetch");
const { googleImage } = require("@bochilteam/scraper");
const {
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia,
} = require("@adiwajshing/baileys");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Validate input
  if (!text)
    throw `Please enter a search term!\nExample: *${usedPrefix}${command} cat*`;

  try {
    // Send wait message
    const waitMsg = await m.reply("🔍 Searching for images... Please wait...");

    // Fetch images from Google
    const images = await googleImage(text);
    if (!images || images.length === 0) throw "No images found for your search";

    // Select random image
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Prepare interactive message
    const interactiveMsg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `Here's your image for: *${text}*\nSource: Google Images`,
            },
            footer: {
              text: "Elaina-MD • Powered by Google",
            },
            header: await prepareWAMessageMedia(
              { image: { url: randomImage } },
              { upload: conn.waUploadToServer }
            ),
            nativeFlowMessage: {
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: `Next ${text} image`,
                    id: `${usedPrefix}${command} ${text}`,
                  }),
                },
              ],
            },
          },
        },
      },
    };

    // Generate and send message
    const msg = generateWAMessageFromContent(m.chat, interactiveMsg, {
      quoted: m,
    });
    await conn.relayMessage(m.chat, msg.message, {});

    // Delete wait message
    await conn.sendMessage(m.chat, { delete: waitMsg.key });
  } catch (error) {
    console.error("Image Search Error:", error);

    // User-friendly error messages
    if (error.message.includes("timeout")) {
      await m.reply("⌛ Search timed out. Please try again later.");
    } else if (error.message.includes("no images")) {
      await m.reply(
        "❌ No images found for your search. Try different keywords."
      );
    } else {
      await m.reply("⚠️ An error occurred. Please try again later.");
    }
  }
};

// Command configuration
handler.help = ["gimage <query> - Search Google for images"];
handler.tags = ["internet", "media"];
handler.command = /^(gimage|image|gi)$/i;

module.exports = handler;
