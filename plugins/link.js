let handler = async (m, { conn, args, isAdmin, isROwner, bot }) => {
  if (m.isGroup) {
    if (!(isAdmin || isROwner))
      throw "Only Group Admin fit use this command! ❌";
  }

  let group = m.chat;
  if (/^[0-9]{5,16}-[0-9]+@g\.us$/.test(args[0])) group = args[0];
  if (!/^[0-9]{5,16}-[0-9]+@g\.us$/.test(group))
    throw "This command na only for group! ❌";

  if (!bot) throw "I no dey for that group o! 😢";
  if (!bot.admin)
    throw "I no be admin for here! Abeg make dem promote me first. 😤";

  m.reply("https://chat.whatsapp.com/" + (await conn.groupInviteCode(group)));
};

// Updated command & help text
handler.help = ["groupinvite"];
handler.tags = ["group"];
handler.command = /^(groupinvite|invite|group-link|grouplink)$/i;

module.exports = handler;
