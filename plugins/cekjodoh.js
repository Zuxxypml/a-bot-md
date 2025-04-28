let handler = async (m, { conn, text, mentionedJid, participants }) => {
  // Filter out bot, admins, and superadmins
  let members = participants.filter(
    (p) => p.id !== conn.user.jid && !p.isAdmin && !p.isSuperAdmin
  );

  if (members.length < 2) {
    return conn.reply(
      m.chat,
      "There must be at least 2 members in the group!",
      m
    );
  }

  // Randomly select two members
  let [user1, user2] = pickRandom(members, 2);

  let jodohReasons = [
    "You both have amazing similarities and complement each other perfectly.",
    "Your relationship is full of understanding and mutual support.",
    "You have strong chemistry and will complement each other well.",
    "You understand each other without needing many words.",
    "You both always find ways to make each other smile.",
    "You share the same life goals and support each other.",
    "You both have great respect for one another.",
    "You can rely on each other in any situation.",
    "You always feel comfortable and safe together.",
    "You both know how to make each other happy.",
    "You share similar interests and enjoy them together.",
    "You complement each other in many ways.",
    "You always support and encourage each other.",
    "You both have a unique way of showing love.",
    "You share many beautiful memories together.",
    "You always find ways to solve problems together.",
    "You understand and accept each other's flaws.",
  ];

  let tidakReasons = [
    "Although you're both great, you might not be compatible together.",
    "You might be better as friends than as a couple.",
    "Your differences are too significant for a romantic relationship.",
    "You may have different visions for life.",
    "Too many differences make your relationship challenging.",
    "You might struggle to find common ground on important matters.",
    "You tend to argue often and find it hard to compromise.",
    "You may lack shared values and principles.",
    "You might be happier with someone else.",
    "Your personality differences might be hard to bridge.",
    "You may find it difficult to communicate effectively.",
    "You might struggle to understand each other's needs.",
    "You may be better off living your own lives.",
    "You may lack long-term compatibility.",
    "You may not share enough common ground on important issues.",
    "You might find it hard to agree on important matters.",
  ];

  // Determine result and reason
  let result = pickRandom(["MATCH", "NO MATCH"]);
  let reason =
    result === "MATCH" ? pickRandom(jodohReasons) : pickRandom(tidakReasons);

  // Reply with formatted message
  conn.reply(
    m.chat,
    `
⬣───「 *MATCH CHECK* 」───⬣
⬡ Name 1: @${user1.id.split`@`[0]}
⬡ Name 2: @${user2.id.split`@`[0]}
⬡ Result: ${result}
⬡ Reason: ${reason}
⬣────────────────⬣
`.trim(),
    m,
    { mentions: [user1.id, user2.id] }
  );
};

handler.help = ["cekjodoh"];
handler.command = /^cekjodoh$/i;
handler.tags = ["cekjodoh"];

module.exports = handler;

function pickRandom(list, n = 1) {
  let result = [];
  for (let i = 0; i < n; i++) {
    let index = Math.floor(Math.random() * list.length);
    result.push(list.splice(index, 1)[0]);
  }
  return result;
}
