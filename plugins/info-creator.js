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
} = require("@whiskeysockets/baileys");

const name = global.nameowner || "Akinade";
const numberowner = global.numberowner || "2349075341378";
const gmail = global.mail || "adebisiakinade.123@gmail.com";
const instagram = global.instagram || "https://www.instagram.com/zuxxypml";

var handler = async (m, { conn }) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN: ${name}
item.ORG: Elaina-MD
item1.TEL;waid=${numberowner}:${numberowner}@s.whatsapp.net
item1.X-ABLabel:Bot Owner Number
item2.EMAIL;type=INTERNET:${gmail}
item2.X-ABLabel:Owner Email
item3.ADR:;;🇳🇬 Nigeria;;;;
item3.X-ABADR:ac
item4.URL:${instagram}
item4.X-ABLabel:Instagram
item5.URL:https://github.com/Akinade/Elaina-MD
item5.X-ABLabel:GitHub
item6.URL:https://akiade.vercel.app
item6.X-ABLabel:Portfolio
END:VCARD`;

  try {
    await conn.sendMessage(
      m.chat,
      {
        contacts: {
          displayName: `${name} (Owner)`,
          contacts: [{ vcard }],
        },
      },
      { quoted: m }
    );

    await conn.sendMessage(
      m.chat,
      {
        text: `This is the contact information for ${name}, the owner of ${
          global.namebot || "Elaina-MD"
        } bot.\n\nPlease be respectful when contacting.`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error sending contact card:", error);
    await conn.reply(
      m.chat,
      "Failed to send contact card. Please try again later.",
      m
    );
  }
};

handler.help = ["owner", "creator", "contactowner"];
handler.tags = ["info"];
handler.command = /^(owner|creator|contactowner|botowner)$/i;
handler.limit = true;

module.exports = handler;
