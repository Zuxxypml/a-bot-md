let handler = async (m, { conn, args, participants, command, usedPrefix }) => {
  const allUsers = global.db.data.users;
  // Build array of users with a skata score
  let users = Object.entries(allUsers)
    .map(([jid, data]) => ({ ...data, jid }))
    .filter((u) => u.skata);

  // If command ends with "gc" or "group", restrict to group participants
  const isGroupOnly = /g(c|ro?up)/i.test(command);
  if (isGroupOnly) {
    users = users.filter((u) => participants.some((p) => p.id === u.jid));
  }

  // Sort by skata descending
  const sorted = users
    .map((u) => ({ jid: u.jid, skata: u.skata, name: u.name }))
    .sort((a, b) => b.skata - a.skata);

  // Determine how many to show (default 15, max 100)
  const limit = args[0]
    ? Math.min(100, Math.max(parseInt(args[0]), 15))
    : Math.min(15, sorted.length);

  // Find your rank
  const jids = sorted.map((u) => u.jid);
  const yourRank = jids.indexOf(m.sender) + 1;

  // Build leaderboard text
  let text = `
*Word-Chain Leaderboard${isGroupOnly ? " (This Group)" : ` Top ${limit}`}*
Your rank: *${yourRank}* of *${sorted.length}*

${
  !isGroupOnly
    ? `Type \`${usedPrefix + command}gc\` to see the group-only leaderboard.\n`
    : ""
}
${sorted
  .slice(0, limit)
  .map((u, i) => {
    const displayName = participants.some((p) => p.id === u.jid)
      ? `(${conn.getName(u.jid)})`
      : u.name;
    return `${i + 1}. ${displayName} — ${u.skata} MMR`;
  })
  .join("\n")}
`.trim();

  conn.reply(m.chat, text, m);
};

handler.help = ["topskata [count]", "topkatagc [count]"];
handler.tags = ["xp"];
handler.command = /^(tops(ambung)?kata(g(c|ro?up))?)$/i;

module.exports = handler;
