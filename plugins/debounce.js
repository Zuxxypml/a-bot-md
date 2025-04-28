let { spawn } = require("child_process");

let handler = async (m, { conn }) => {
  if (!process.send)
    throw "Wrong command: Use `node index.js` instead of `node main.js` to run the bot properly.";

  if (global.conn.user.jid == conn.user.jid) {
    await m.reply("_Restarting the bot..._\n\nPlease wait a moment.");
    await global.db.write();
    process.send("reset");
  } else {
    throw "_Heeeyyy... not allowed!_";
  }
};

handler.help = ["restart" + (process.send ? "" : " (Not working)")];
handler.tags = ["host"];
handler.command = /^debounce|restart$/i;
handler.rowner = true; // Only real owner can restart

module.exports = handler;
