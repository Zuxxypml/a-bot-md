const crypto = require("crypto");

const XP_FIRST_TIME = 2500;
const XP_LINK_CREATOR = 15000;
const XP_BONUS = {
  5: 40000,
  10: 100000,
  20: 250000,
  50: 1000000,
  100: 10000000,
};

let handler = async (m, { conn, usedPrefix, text }) => {
  const users = global.db.data.users;

  // If the user provided a referral code
  if (text) {
    // Prevent re-using a referral
    if ("ref_count" in users[m.sender]) {
      throw "❌ You cannot use a referral code!";
    }

    // Find who created that code
    const creatorJid = Object.entries(users).find(
      ([, u]) => u.ref_code === text.trim()
    )?.[0];

    if (!creatorJid) {
      throw "❌ Invalid referral code.";
    }

    // Increment the creator's count and calculate bonus
    const countBefore = users[creatorJid].ref_count++;
    const bonusXp = XP_BONUS[countBefore] || 0;

    // Award XP
    users[creatorJid].exp += XP_LINK_CREATOR + bonusXp;
    users[m.sender].exp += XP_FIRST_TIME;
    users[m.sender].ref_count = 0; // mark that this user has used a referral

    // Notify the referred user
    await m.reply(
      `🎉 Congratulations!\n\nYou earned +${XP_FIRST_TIME} XP for using a referral code.`
    );

    // Notify the code creator
    await m.reply(
      `📢 Someone used your referral code!\n\nYou earned +${
        XP_LINK_CREATOR + bonusXp
      } XP.`,
      creatorJid
    );

    // If no code was provided, generate or show the user's own code
  } else {
    // Generate a code if not already present
    const me = users[m.sender];
    me.ref_code =
      me.ref_code ||
      Array.from(
        { length: 11 },
        () =>
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[
            crypto.randomInt(62)
          ]
      ).join("");
    me.ref_count = me.ref_count || 0;

    const code = me.ref_code;
    const commandText = `${usedPrefix}ref ${code}`;
    const commandLink = `https://wa.me/${
      conn.user.jid.split("@")[0]
    }?text=${encodeURIComponent(commandText)}`;
    const shareText =
      `Get ${XP_FIRST_TIME} XP when someone uses your referral code!\n\n` +
      `Referral Code: *${code}*\n\n` +
      `${commandLink}`;

    // Show referral details
    await m.reply(
      `🔗 *Referral Program*\n\n` +
        `Earn +${XP_LINK_CREATOR} XP for each new user who uses your code.\n` +
        `${me.ref_count} user(s) have already used your code.\n\n` +
        `Your referral code: *${code}*\n\n` +
        `Share this link with friends:\n${commandLink}\n\n` +
        `Or send them this message:\nwa.me/?text=${encodeURIComponent(
          shareText
        )}\n\n` +
        `*Bonus XP*: \n` +
        Object.entries(XP_BONUS)
          .map(([num, xp]) => `${num} users = +${xp} XP`)
          .join("\n")
    );
  }
};

handler.help = ["ref"];
handler.tags = ["fun"];
handler.command = ["ref"];
handler.register = true;

module.exports = handler;
