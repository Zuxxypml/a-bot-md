let handler = async (m, { conn, text }) => {
  if (!text) throw "Please provide text for the broadcast!";

  let chats = Object.keys(await conn.chats);
  conn.reply(m.chat, `_Sending broadcast to ${chats.length} chats..._`, m);

  for (let id of chats) {
    await sleep(3000); // wait 3 seconds between messages (safe delay)
    conn.relayMessage(
      id,
      {
        extendedTextMessage: {
          text: text.trim(),
          contextInfo: {
            externalAdReply: {
              title: wm,
              mediaType: 1,
              previewType: 0,
              renderLargerThumbnail: true,
              thumbnailUrl: "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg",
              sourceUrl: "",
            },
          },
          mentions: [m.sender],
        },
      },
      {}
    );
  }
  m.reply("✅ Broadcast finished!");
};

handler.help = ["broadcast", "bc"].map((v) => v + " <text>");
handler.tags = ["owner"];
handler.command = /^(broadcast|bc)$/i;
handler.owner = true;

module.exports = handler;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
