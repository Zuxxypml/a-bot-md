const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

let handler = async (m, { conn }) => {
  // Ensure user replied to a message
  if (!m.quoted) throw "❗ Please reply to a View Once image/video message.";

  // Check if the quoted message is view-once
  if (!(/viewOnce(MessageV2)?/.test(m.quoted.mtype) || m.quoted.viewOnce)) {
    throw "⚠️ This is not a view-once message.";
  }

  // Download the media content
  const msg = m.quoted;
  const isImage = msg.mtype === "imageMessage";
  const isVideo = msg.mtype === "videoMessage";
  const mediaStream = await downloadContentFromMessage(
    msg,
    isImage ? "image" : "video"
  );
  let buffer = Buffer.from([]);
  for await (const chunk of mediaStream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  // Send back the media file with original caption (if any)
  const caption = msg.caption || msg.text || "";
  if (isVideo) {
    return conn.sendFile(m.chat, buffer, "viewonce.mp4", caption, m);
  } else if (isImage) {
    return conn.sendFile(m.chat, buffer, "viewonce.jpg", caption, m);
  }
};

handler.help = ["readvo"];
handler.tags = ["info"];
handler.command = ["readviewonce", "read", "liat", "readvo", "rvo"];

module.exports = handler;
