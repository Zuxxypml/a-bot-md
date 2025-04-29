let { npmstalk } = require("../lib/npmstalk");

let handler = async (m, { command, text, conn, usedPrefix }) => {
  if (!text)
    throw (
      "Enter an NPM package name.\n\nExample: " +
      usedPrefix +
      command +
      " @whiskeysockets/baileys"
    );

  try {
    // React to message with a clock emoji
    conn.sendMessage(m.chat, {
      react: {
        text: "🕒",
        key: m.key,
      },
    });

    let res = await npmstalk(text);
    if (!res) throw res;

    let caption = `*📦 N P M   S T A L K*

• 👤 *Name:* ${res.name}
• ◀️ *Latest Version:* ${res.versionLatest}
• ▶️ *Update Version:* ${res.versionUpdate}
• 🔂 *Publish Version:* ${res.versionPublish}
• 🛠️ *Latest Dependencies:* ${res.latestdependecies}
• 🛠️ *Published Dependencies:* ${res.publishdependecies}
• 📈 *Publish Time:* ${res.publishTime}
• 🕒 *Latest Publish Time:* ${res.latestPublishTime}
`;

    // Send package info with image
    conn.sendFile(
      m.chat,
      "https://telegra.ph/file/b2b2502609f627a794daa.jpg",
      "image.jpg",
      caption,
      m
    );
  } catch (e) {
    conn.reply(m.chat, "Error. Something went wrong 😔", m);
  }
};

handler.help = ["npmstalk"];
handler.tags = ["tools"];
handler.command = /^(npmstalk)$/i;

module.exports = handler;
