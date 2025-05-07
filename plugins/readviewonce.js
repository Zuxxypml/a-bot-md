const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const handler = async (m, { conn }) => {
  if (!m.quoted) {
    return conn.sendMessage(
      m.chat,
      {
        text: "❗ Please reply to a *View Once* image or video message.",
      },
      { quoted: m }
    );
  }

  const quoted = m.quoted;
  const type = Object.keys(quoted.message || {})[0];
  const viewOnceContent = quoted.message?.[type]?.message;

  if (!viewOnceContent) {
    return conn.sendMessage(
      m.chat,
      {
        text: "⚠️ This is not a valid *View Once* message.",
      },
      { quoted: m }
    );
  }

  const isImage = !!viewOnceContent.imageMessage;
  const isVideo = !!viewOnceContent.videoMessage;

  const mediaType = isImage ? "imageMessage" : isVideo ? "videoMessage" : null;
  if (!mediaType) {
    return conn.sendMessage(
      m.chat,
      {
        text: "⚠️ Only *View Once* images or videos are supported.",
      },
      { quoted: m }
    );
  }

  const mediaMsg = viewOnceContent[mediaType];
  if (!mediaMsg?.mediaKey || !mediaMsg?.url) {
    return conn.sendMessage(
      m.chat,
      {
        text: "❌ Cannot fetch the media. It may have been viewed already or expired.",
      },
      { quoted: m }
    );
  }

  try {
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
  } catch (err) {
    console.error("ViewOnce fetch error:", err);
    return conn.sendMessage(
      m.chat,
      {
        text: "❌ Failed to download the view-once media. It might have been deleted or already opened.",
      },
      { quoted: m }
    );
  }
};

handler.help = ["readvo"];
handler.tags = ["info"];
handler.command = ["readviewonce", "read", "readvo", "rvo"];

module.exports = handler;
