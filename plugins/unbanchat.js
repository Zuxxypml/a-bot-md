let handler = async (m, { conn }) => {
  const chat = (global.db.data.chats[m.chat] ||= {});

  if (!chat.isBanned) {
    throw `_This chat is already active._`;
  }

  chat.isBanned = false;
  m.reply(
    "✅ *Chat unbanned successfully!*\nThe bot will now respond to messages as usual."
  );
};

handler.help = ["unbanchat"];
handler.tags = ["owner"];
handler.command = /^unbanchat$/i;
handler.owner = true;

module.exports = handler;
