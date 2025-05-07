const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

let handler = (m) => m;

handler.before = async function (m, { conn }) {
  const chatConfig = global.db?.data?.chats?.[m.chat];
  if (!chatConfig?.viewonce) return;

  const msg = m.quoted || m;

  if (msg.mtype !== "viewOnceMessageV2") return;

  const viewOnce = msg.message?.viewOnceMessageV2?.message;
  if (!viewOnce) return;

  const mediaType = Object.keys(viewOnce)[0];
  const media = viewOnce[mediaType];

  if (!media?.mediaKey || !media?.url) {
    return conn.sendMessage(
      m.chat,
      {
        text: "❌ View-once media is inaccessible or expired.",
      },
      { quoted: m }
    );
  }

  try {
    const stream = await downloadContentFromMessage(
      media,
      /image/.test(mediaType) ? "image" : "video"
    );

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    await conn.sendFile(
      m.chat,
      buffer,
      /image/.test(mediaType) ? "unlocked.jpg" : "unlocked.mp4",
      media.caption || "",
      m
    );
  } catch (error) {
    console.error("View-once error:", error);
    await conn.sendMessage(
      m.chat,
      {
        text: `⚠️ Failed to fetch media:\n${error.message}`,
      },
      { quoted: m }
    );
  }
};

module.exports = handler;
