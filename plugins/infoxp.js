let handler = async (m, { conn, usedPrefix }) => {
  const message = `
🌟 *XP & Limit Information* 🌟

Every feature in this bot uses *limits* to ensure fair usage for all users.

📊 *How to Get More XP/Limit:*
${conn.readmore}
1. *Daily XP Claim* - Get free XP every day
   → Type: ${usedPrefix}claim

2. *Play Games* - Earn XP by playing fun games
   → Type: ${usedPrefix}menu game

3. *Active Chatting* - Earn XP by chatting with the bot

4. *Group Activities* - Participate in group activities

💱 *How to Convert XP to Limit:*
After collecting XP, you can convert it to limit:
→ Type: ${usedPrefix}buy

🔍 *Check Your Balance:*
→ Type: ${usedPrefix}balance
→ Or click "Check XP" below

💡 *Important Notes:*
- Features requiring limit are marked with *($) symbol*
- When your limit reaches 0, premium features will stop working
- Higher XP levels unlock special privileges
`.trim();

  const footer = `
🔄 *Daily Reset:* Your XP/Limit status resets every 24 hours
📈 *Bonus:* Active users get bonus XP on weekends
`.trim();

  await conn.reply(m.chat, message, footer, m);
};

handler.help = ["infoexp", "xpinfo", "limitinfo"];
handler.tags = ["info", "xp"];
handler.command = /^(infoe?xp|xpinfo|limitinfo)$/i;

module.exports = handler;
