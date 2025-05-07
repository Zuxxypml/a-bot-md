const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const handler = async (m, { conn }) => {
  let q = m.quoted || m;

  if (!q || !q.message) {
    return conn.sendMessage(
      m.chat,
      { text: "❗ Please reply to a *View Once* image or video message." },
      { quoted: m }
    );
  }

  const messageContent = q.message;
  const isViewOnceV2 = messageContent.viewOnceMessageV2;
  const isViewOnce = messageContent.viewOnceMessage;

  let innerMsg;
  if (isViewOnceV2) innerMsg = messageContent.viewOnceMessageV2.message;
  else if (isViewOnce) innerMsg = messageContent.viewOnceMessage.message;
  else {
    return conn.sendMessage(
      m.chat,
      { text: "⚠️ This is not a valid *View Once* media message." },
      { quoted: m }
    );
  }

  const type = Object.keys(innerMsg)[0]; // imageMessage or videoMessage
  const mediaMsg = innerMsg[type];

  if (!["imageMessage", "videoMessage"].includes(type)) {
    return conn.sendMessage(
      m.chat,
      { text: "⚠️ Only *View Once* images or videos are supported." },
      { quoted: m }
    );
  }

  if (!mediaMsg?.mediaKey || !mediaMsg?.url) {
    return conn.sendMessage(
      m.chat,
      { text: "❌ This media has likely expired or already been viewed." },
      { quoted: m }
    );
  }

  try {
    const stream = await downloadContentFromMessage(
      mediaMsg,
      type === "imageMessage" ? "image" : "video"
    );

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return conn.sendFile(
      m.chat,
      buffer,
      type === "imageMessage" ? "viewonce.jpg" : "viewonce.mp4",
      mediaMsg.caption || "",
      m
    );
  } catch (err) {
    console.error("readviewonce error:", err);
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
