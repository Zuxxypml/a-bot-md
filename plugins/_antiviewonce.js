const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

let handler = (m) => m;

handler.before = async function (m, { conn }) {
  // Check if anti-view-once mode is enabled in this chat
  if (!db.data.chats[m.chat].viewonce) return;

  // Target either the quoted message or the current one
  let q = m.quoted ? m.quoted : m;

  // If the message is a view-once type
  if (q.mtype == "viewOnceMessageV2") {
    let msg = q.message;
    let type = Object.keys(msg)[0];

    // Download the content (image or video)
    let media = await downloadContentFromMessage(
      msg[type],
      type == "imageMessage" ? "image" : "video"
    );
    let buffer = Buffer.from([]);

    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Send back the content as a normal file (no view-once anymore)
    if (/video/.test(type)) {
      return conn.sendFile(
        m.chat,
        buffer,
        "media.mp4",
        msg[type].caption || "",
        m
      );
    } else if (/image/.test(type)) {
      return conn.sendFile(
        m.chat,
        buffer,
        "media.jpg",
        msg[type].caption || "",
        m
      );
    }
  }
};

module.exports = handler;
