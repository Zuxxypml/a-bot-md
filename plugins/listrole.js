let handler = async (m, { usedPrefix }) => {
  let role = global.db.data.users[m.sender].role;
  m.reply(
    `
Your role is = *${role}*
${conn.readmore}Type *${usedPrefix}levelup* to update your Role

*Role List*

level  10 = Beginner
level  20 = Average III
level  30 = Average II
level  40 = Average I
level  50 = Loud III
level  60 = Loud II
level  70 = Loud I
level  80 = Flawless
level  90 = Paragon
    `.trim()
  );
};
handler.help = ["role"];
handler.tags = ["xp"];
handler.command = /^role$/i;

module.exports = handler;
