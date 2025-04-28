let handler = async (m, { conn, text }) => {
  conn.game = conn.game ? conn.game : {};

  try {
    if (conn.game) {
      delete conn.game;
      conn.reply(m.chat, `Successfully deleted Tic Tac Toe (ttt) session.`, m);
    } else {
      m.reply(`No Tic Tac Toe (ttt) session found.`);
    }
  } catch (e) {
    m.reply("Error deleting session.");
  }
};

// BY RIZXYU
handler.help = ["delttt"];
handler.tags = ["game"];
handler.command = /^(del(sesi)?ttt|dellsesitt)$/i;
handler.limit = true;

handler.register = true;
handler.fail = null;

module.exports = handler;
