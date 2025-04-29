const handler = async (
  m,
  { conn, args, participants, command, usedPrefix }
) => {
  // Helper functions
  const sortBy =
    (property, ascending = false) =>
    (a, b) =>
      ascending ? a[property] - b[property] : b[property] - a[property];

  const formatUser = (user, participants) =>
    participants.some((p) => p.id === user.jid)
      ? `${conn.getName(user.jid)} (wa.me/${user.jid.split("@")[0]})`
      : user.name || user.jid;

  // Get and filter users
  let users = Object.entries(global.db.data.users).map(([jid, user]) => ({
    ...user,
    jid,
    mmr: (user.suit || 0) + (user.skata || 0),
  }));

  const isGroup = command.includes("group");
  if (isGroup) {
    users = users.filter((user) => participants.some((p) => p.id === user.jid));
  }

  // Determine result length
  const defaultLength = isGroup ? 10 : 5;
  const length =
    args[0] && !isNaN(args[0])
      ? Math.min(50, Math.max(parseInt(args[0]), defaultLength))
      : defaultLength;

  // Sort users by different metrics
  const sortedUsers = {
    exp: [...users].sort(sortBy("exp")),
    limit: [...users].sort(sortBy("limit")),
    level: [...users].sort(sortBy("level")),
    mmr: [...users].sort(sortBy("mmr")),
  };

  // Get user positions
  const getUserPosition = (jid, array) =>
    array.findIndex((user) => user.jid === jid) + 1;

  // Generate leaderboard sections
  const sections = Object.entries({
    "🌟 XP Leaderboard": "exp",
    "💎 Limit Leaderboard": "limit",
    "📈 Level Leaderboard": "level",
    "⚔️ MMR Leaderboard": "mmr",
  }).map(([title, key]) => {
    const topUsers = sortedUsers[key].slice(0, length);
    const userPosition = getUserPosition(m.sender, sortedUsers[key]);

    return (
      `• *${title} ${isGroup ? "(Group)" : ""}*\n` +
      `You: *${userPosition}* of *${sortedUsers[key].length}*\n` +
      topUsers
        .map(
          (user, i) =>
            `${i + 1}. ${formatUser(user, participants)}: *${user[key]}*`
        )
        .join("\n")
    );
  });

  // Compose final message
  const text =
    `🏆 *${isGroup ? "Group" : "Global"} Leaderboard* 🏆\n\n` +
    sections.join("\n\n") +
    `\n\nUse *${usedPrefix}lbgroup* for group-only rankings`;

  // Send message with mentions
  const mentionedUsers = Object.values(sortedUsers)
    .flatMap((arr) => arr.slice(0, length).map((u) => u.jid))
    .filter((jid) => !participants.some((p) => p.id === jid));

  await conn.reply(m.chat, text, m, { mentions: mentionedUsers });
};

handler.help = [
  "leaderboard [amount] - Global leaderboard",
  "leaderboardgroup [amount] - Group leaderboard",
  "lb [amount] - Short for leaderboard",
];
handler.tags = ["xp", "ranking"];
handler.command = /^(leaderboard|lb)(g(c|ro?up))?$/i;

module.exports = handler;
