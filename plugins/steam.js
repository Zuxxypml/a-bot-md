const { steam } = require("../lib/steam"); // Import Steam scraper function
const {
  default: makeWASocket,
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  downloadHistory,
  proto,
  getMessage,
  generateWAMessageContent,
  prepareWAMessageMedia,
} = require("@adiwajshing/baileys");

let handler = async (m, { conn, command, text, args }) => {
  // Check if search query exists
  if (!text) {
    throw `Please enter the title you want to search!\n\nExample:\n${usedPrefix}${command} miside`;
  }

  try {
    // Send processing message
    conn.reply(
      m.chat,
      `_Processing, please wait..._\n*Please turn off auto-download in WhatsApp.*\n*The trailer files sent by bot are large*`,
      m
    );

    // Get response from Steam scraper
    const response = await steam(text);
    var {
      id,
      name,
      description,
      screenshots,
      trailers,
      price,
      developers,
      genres,
      release,
      url,
    } = response;

    // Create caption with game info
    let capt = `╭──── 〔STEAM〕 ─⬣\n`;
    capt += ` ⬡ *Title* : ${name}\n`;
    capt += ` ⬡ *ID* : ${id}\n`;
    capt += ` ⬡ *Genre* : ${genres}\n`;
    capt += ` ⬡ *Price* : ${price}\n`;
    capt += ` ⬡ *Release* : ${release}\n`;
    capt += ` ⬡ *Developers* : ${developers}\n`;
    capt += ` ⬡ *Url* : ${url}\n`;
    capt += `╰────────⬣\n`;
    capt += ` ⬡ ${description}\n`;

    // Send trailer video with caption
    await conn.sendMessage(
      m.chat,
      {
        image: { url: trailers[0].mp4 },
        caption: capt,
      },
      { quoted: m }
    );

    // Prepare screenshots carousel
    let ult = screenshots.splice(0, screenshots.length);
    let i = 1;
    let cards = [];

    // Create interactive cards for each screenshot
    for (let pus of ult) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `Screenshot #${i++}`,
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: name,
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: "</> Steam </>\n",
          hasMediaAttachment: true,
          imageMessage: await createImage(pus), // Generate image message
        }),
        nativeFlowMessage:
          proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Source",
                  url: url,
                  merchant_url: url,
                }),
              },
            ],
          }),
      });
    }

    // Generate carousel message
    const bot = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: null,
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: namebot,
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false,
              }),
              carouselMessage:
                proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                  cards: [...cards], // Spread all screenshot cards
                }),
            }),
          },
        },
      },
      {}
    );

    // Send the carousel message
    await conn.relayMessage(m.chat, bot.message, {
      messageId: bot.key.id,
    });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

// Command configuration
handler.help = ["steam <game title>"];
handler.command = /^(steam)$/i;
handler.tags = ["search", "tools"];
handler.premium = false;
handler.limit = true;
module.exports = handler;

// Helper function to create image message
async function createImage(url) {
  const { imageMessage } = await generateWAMessageContent(
    {
      image: { url },
    },
    {
      upload: conn.waUploadToServer,
    }
  );
  return imageMessage;
}
