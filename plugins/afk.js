let handler = (m, { text }) => {
  if (text.length >= 180) throw `Your AFK reason is too long!`;
  let user = global.db.data.users[m.sender];
  user.afk = +new Date();
  user.afkReason = text;

  let message = `
@${m.sender.split`@`[0]} is now AFK${text ? `\nReason: ${text}` : ""}.
`.trim();

  m.reply(message);
};
handler.help = ["afk"];
handler.tags = ["main"];
handler.command = /^afk$/i;

module.exports = handler;
