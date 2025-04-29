const PhoneNumber = require("awesome-phonenumber");
const levelling = require("../lib/levelling");

let handler = async (m, { conn, usedPrefix }) => {
  let pp = false;
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;

  try {
    pp = await conn.profilePictureUrl(who, "image");
  } catch (e) {
    // ignore error if profile picture isn't accessible
  }

  const about =
    ((await conn.fetchStatus(who).catch(console.error)) || {}).status || "";
  const user = global.db.data.users[who];

  if (!user) throw "User is not registered.";

  const { name, limit, exp, pasangan, age, level, role, banned, registered } =
    user;
  const { min, xp, max } = levelling.xpRange(level, global.multiplier);
  const prem = global.prems.includes(who.split("@")[0]);
  const remainingXP = max - xp;
  const partner = pasangan
    ? `In a relationship with @${pasangan.split("@")[0]}`
    : "Single";
  const nameDisplay = registered
    ? name
    : await conn.getName(who, { withoutContact: true });

  const profileText = `
👤 *Name:* ${nameDisplay}
📱 *Number:* https://wa.me/${who.replace(/[^0-9]/g, "")}
📄 *Bio:* ${about || "No bio set"}

🧾 *Status:*
• Registered: ${registered ? "✅ Yes" : "❌ No"}
• Banned: ${banned ? "✅ Yes" : "❌ No"}
• Premium: ${prem ? "✅ Yes" : "❌ No"}

📈 *Experience:*
• XP: ${exp} (${exp - min} / ${xp})
• Level: ${level}
• Role: ${role}
• ${
    remainingXP <= 0
      ? `✅ Ready for *${usedPrefix}levelup*`
      : `❌ Need ${remainingXP} more XP to level up`
  }

❤️ *Relationship:* ${partner}
🎫 *Limit:* ${limit}
`.trim();

  if (pp) {
    conn.sendFile(m.chat, pp, "profile.jpg", profileText, m, {
      mentions: [pasangan],
    });
  } else {
    m.reply(profileText);
  }
};

handler.help = ["profile @user"];
handler.tags = ["xp"];
handler.command = /^profile?$/i;

module.exports = handler;
