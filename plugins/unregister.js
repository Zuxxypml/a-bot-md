const { createHash } = require("crypto");

let handler = async function (m, { conn, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];

  // Cooldown: 24 hours (in milliseconds)
  const cooldown = 86400000;
  let nextAvailable = user.unreg + cooldown;

  // Check cooldown
  if (new Date() - user.unreg < cooldown) {
    throw `❗ You’ve already re-registered today.\n⏳ Please wait: ${conn.clockString(
      nextAvailable - Date.now()
    )}`;
  }

  // Unregister the user
  user.registered = false;
  user.unreg = Date.now();

  m.reply(
    `✅ *${command} successful!*\nPlease type *${usedPrefix}register* to register again.`
  );
};

handler.help = ["unregister", "daftarulang"];
handler.tags = ["main"];
handler.command = /^daftarulang|unreg(ister)?$/i;
handler.register = true;

module.exports = handler;
