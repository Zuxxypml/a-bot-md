let handler = (m) => m;

const levelling = require("../lib/levelling");

handler.before = function (m) {
  let user = global.db.data.users[m.sender];
  if (!user.autolevelup) return true;

  let before = user.level * 1;
  while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
    user.level++;
  }

  if (before !== user.level) {
    this.reply(
      m.chat,
      `
🎉 Congratulations! You have leveled up! 🎉
*Level:* ${before} ➔ *${user.level}*
*Reward:* You can now claim more daily XP as you level up!
*Your Current Role:* *${user.role}*

Type *.role* to view your available roles.
Type *.cek* to check your profile.
`.trim(),
      m
    );
  }
};

module.exports = handler;
