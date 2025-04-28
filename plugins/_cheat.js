let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  user.money = 999999999;
  user.limit = 999999999999;
  user.exp = 99999999999;
  user.level = 1000;
  m.reply(`_*CHEAT SUCCESSFULLY ACTIVATED — USE IT WISELY!*_`);
};

handler.command = /^(hesoyam)$/i;
handler.owner = true;
handler.premium = false;

module.exports = handler;
