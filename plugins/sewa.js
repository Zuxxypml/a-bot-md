let handler = async (m, { conn, usedPrefix: _p }) => {
  let capt = `
===================
Group Activation Codes
===================
1. Silver [Free]
   Trial active for 3 days:
   https://wa.me/${conn.user.jid.split("@")[0]}?text=.claim+code

2. Gold
   Price:
   - New users: ₦5,000
   - Renewal:   ₦5,000
   Validity: 30 Days

3. Diamond
   Price:
   - New users: ₦8,000
   - Renewal:   ₦8,000
   Validity: 60 Days

Bot Features for Groups:
• Hidetag / mention all members
• Welcome, Bye, Anti-delete [on/off]
• Group open/close
• Game features [on/off]

===================
PREMIUM MEMBER
===================
[30 Days] Prices:
- New users: ₦10,000
- Renewal:   ₦10,000

What you get as Premium?
• Unlimited usage limits
• Higher daily XP claims
• Up to 5 group redeem codes
• “Become Bot” feature
• And much more!
`.trim();

  let msg = await m.reply(capt);
  setTimeout(() => {
    conn.reply(
      m.chat,
      `Have you decided which option to choose?\n\n` +
        `Feel free to contact the owner:\n` +
        `${_p}owner\n\n` +
        `Or view payment details:\n` +
        `${_p}payment`,
      msg
    );
  }, 50000);
};

handler.help = ["sewabot", "premium"];
handler.tags = ["main", "group"];
handler.command = /^(sewa(bot)?|premium)$/i;

module.exports = handler;
