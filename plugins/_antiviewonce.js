import { downloadContentFromMessage } from "@whiskeysockets/baileys";

const handler = (m) => m;

handler.before = async function (m, { conn }) {
  if (!db.data.chats?.[m.chat]?.viewonce) return;

  const q = m.quoted || m;

  if (q.mtype === "viewOnceMessageV2") {
    const innerMessage = q.message?.viewOnceMessageV2?.message;
    if (!innerMessage) return;

    const type = Object.keys(innerMessage)[0];
    const mediaMsg = innerMessage[type];

    // Check for valid media keys before downloading
    if (!mediaMsg?.mediaKey || !mediaMsg?.url) {
      await conn.sendMessage(
        m.chat,
        {
          text: "❌ Cannot access this view-once media. It may have already been viewed or expired.",
        },
        { quoted: m }
      );
      return;
    }

    try {
      const stream = await downloadContentFromMessage(
        mediaMsg,
        /image/.test(type) ? "image" : "video"
      );

      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      await conn.sendFile(
        m.chat,
        buffer,
        /image/.test(type) ? "media.jpg" : "media.mp4",
        mediaMsg.caption || "",
        m
      );
    } catch (err) {
      console.error("Download failed:", err);
      await conn.sendMessage(
        m.chat,
        {
          text: "⚠️ Failed to download view-once media.\n" + err.message,
        },
        { quoted: m }
      );
    }
  }
};

export default handler;
