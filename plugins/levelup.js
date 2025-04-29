const levelling = require("../lib/levelling");

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  // Check if user can level up
  if (!levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
    const { min, xp, max } = levelling.xpRange(user.level, global.multiplier);
    const neededXP = max - user.exp;
    const progress = Math.round(((user.exp - min) / xp) * 100);

    return conn.reply(
      m.chat,
      `📊 *Level Progress*\n\n` +
        `Current Level: *${user.level}*\n` +
        `XP: ${user.exp - min}/${xp} (${progress}%)\n` +
        `You need *${neededXP}* more XP to level up!\n\n` +
        `Keep chatting to gain more XP!`,
      m
    );
  }

  // Level up process
  const oldLevel = user.level;
  while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
    user.level++;
  }

  // Level up rewards
  const levelDiff = user.level - oldLevel;
  const rewardMultiplier = 1 + user.level * 0.1; // 10% more daily XP per level

  conn.reply(
    m.chat,
    `🎉 *LEVEL UP!* 🎉\n\n` +
      `From: *Level ${oldLevel}*\n` +
      `To: *Level ${user.level}* (+${levelDiff})\n\n` +
      `✨ *Rewards Unlocked* ✨\n` +
      `• Daily XP bonus: *${rewardMultiplier.toFixed(1)}x*\n` +
      `• New role: *${user.role || "Member"}*\n\n` +
      `Keep going to reach higher levels!`,
    m
  );
};

handler.help = ["levelup - Check your level progress"];
handler.tags = ["xp", "game"];
handler.command = /^levelup|lvl|level$/i;

module.exports = handler;
