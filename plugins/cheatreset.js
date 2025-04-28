let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  //global.db.data.users[m.sender].koin = 0
  global.db.data.users[m.sender].limit = 0;
  global.db.data.users[m.sender].exp = 0;
  global.db.data.users[m.sender].level = 0;
  m.reply(`Reset successful. All *EXP* and *LIMIT* have been set to zero.`);
};

handler.command = /^(cheatreset)$/i;
handler.owner = true;
handler.premium = false;

module.exports = handler;
