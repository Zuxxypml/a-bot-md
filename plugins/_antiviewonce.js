import { downloadContentFromMessage } from "@whiskeysockets/baileys";

const handler = (m) => m;

handler.before = async function (m, { conn }) {
  // Ensure anti-view-once is enabled for this chat
  if (!db.data.chats?.[m.chat]?.viewonce) return;

  // Target either the quoted or current message
  const q = m.quoted || m;

  // Only proceed if it's a view-once message
  if (q.mtype === "viewOnceMessageV2") {
    const innerMessage = q.message?.viewOnceMessageV2?.message;
    if (!innerMessage) return;

    const type = Object.keys(innerMessage)[0];
    const mediaMsg = innerMessage[type];

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
  }
};

export default handler;
