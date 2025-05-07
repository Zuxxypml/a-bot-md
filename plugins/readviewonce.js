const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

let handler = async (m, { conn }) => {
  if (!m.quoted) throw "❗ Please reply to a View Once image/video message.";

  const quoted = m.quoted;
  const type = Object.keys(quoted.message || {})[0];
  const viewOnceContent = quoted.message?.[type]?.message;

  if (!viewOnceContent)
    throw "⚠️ This doesn't appear to be a proper view-once message.";

  const isImage = !!viewOnceContent.imageMessage;
  const isVideo = !!viewOnceContent.videoMessage;

  const mediaType = isImage ? "imageMessage" : isVideo ? "videoMessage" : null;
  if (!mediaType)
    throw "⚠️ Only view-once *images* and *videos* are supported.";

  const mediaMsg = viewOnceContent[mediaType];
  const stream = await downloadContentFromMessage(
    mediaMsg,
    isImage ? "image" : "video"
  );

  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const caption = mediaMsg.caption || "";

  return conn.sendFile(
    m.chat,
    buffer,
    isImage ? "viewonce.jpg" : "viewonce.mp4",
    caption,
    m
  );
};

handler.help = ["readvo"];
handler.tags = ["info"];
handler.command = ["readviewonce", "read", "liat", "readvo", "rvo"];

module.exports = handler;
