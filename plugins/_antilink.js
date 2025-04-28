let handler = (m) => m;

let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

handler.before = async function (m, { user, groupMetadata, bot }) {
  if (!m.isGroup) return true; // Only work in groups
  if (m.isBaileys && m.fromMe) return true; // Ignore bot's own messages

  let chat = global.db.data.chats[m.chat];
  let isGroupLink = linkRegex.test(m.text); // Check if the message contains a WhatsApp group link

  if (chat.antiLink && isGroupLink) {
    m.reply(
      "_Group link detected!_\n\nThis group has anti-link protection enabled."
    );

    if (user.admin) return true; // If sender is an admin, ignore

    if (bot.admin) {
      if (
        global.opts["restrict"] ||
        global.db.data.settings[this.user.jid].restrict
      ) {
        await m.reply("_You will be removed from the group..._");
        this.groupRemove(m.chat, [m.sender]);
      }
    } else {
      m.reply(
        "_This group is Anti-Link_\n\nBut I am not an admin, so I cannot kick members."
      );
    }
  }
  return true;
};

module.exports = handler;
