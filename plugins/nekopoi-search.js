let {
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

const NekoPoi = require("../lib/nekopoi");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Please enter a title to search!\n\nExample:\n${usedPrefix}${command} blue archive`;
  }

  try {
    conn.reply(m.chat, `_Processing your request, please wait..._`, m);

    // Fetch response from the NekoPoi scraper
    const response = await NekoPoi.search(args[0]);
    let { type, title, images, url } = response[0];

    let caption = `╭──── 〔NEKOPOI〕 ─⬣\n`;
    caption += ` ⬡ *Title* : ${title}\n`;
    caption += ` ⬡ *Type* : ${type}\n`;
    caption += `╰────────⬣\n`;
    caption += ` ⬡ *URL* : ${url}\n`;

    let media = await prepareWAMessageMedia(
      { image: { url: images } },
      { upload: conn.waUploadToServer }
    );

    let msg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            body: {
              text: caption,
            },
            footer: {
              text: wm, // Make sure `wm` is defined somewhere in your global config
            },
            header: proto.Message.InteractiveMessage.Header.create({
              ...media,
              title: "",
              subtitle: "",
              hasMediaAttachment: false,
            }),
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Bot Update Channel",
                    url: "https://chat.whatsapp.com/Ks8h1iSJ0xgDRmxYrpwdwu",
                    merchant_url:
                      "https://chat.whatsapp.com/Ks8h1iSJ0xgDRmxYrpwdwu",
                  }),
                },
              ],
            },
            contextInfo: {
              quotedMessage: m.message,
              participant: m.sender,
              ...m.key,
            },
          },
        },
      },
    };

    // Send image with caption (fallback in case interactiveMessage isn't supported)
    await conn.sendMessage(
      m.chat,
      {
        image: { url: images },
        caption: caption,
      },
      { quoted: m }
    );
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ["nekopoisearch"];
handler.command = /^(nekopoisearch|nekopois)$/i;
handler.tags = ["downloader", "tools"];
handler.premium = true;
handler.nsfw = true;

module.exports = handler;
