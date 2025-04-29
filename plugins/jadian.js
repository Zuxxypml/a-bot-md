let handler = async (m, { conn, participants }) => {
  try {
    // Get all participant IDs
    let ps = participants.map((v) => v.id);

    // Filter out bot and non-users if needed
    ps = ps.filter((id) => !id.includes(conn.user.jid));

    // Need at least 2 participants
    if (ps.length < 2) {
      return conn.reply(
        m.chat,
        "Need at least 2 group members to matchmake!",
        m
      );
    }

    // Select two distinct random participants
    let a = ps[Math.floor(Math.random() * ps.length)];
    let b;
    do {
      b = ps[Math.floor(Math.random() * ps.length)];
    } while (b === a);

    // Get their names
    let nameA = conn.getName(a) || "Someone";
    let nameB = conn.getName(b) || "Someone";

    // Generate random compatibility percentage
    let compatibility = Math.floor(Math.random() * 101);

    // Create romantic message with different outcomes
    let messages = [
      `💘 *Matchmaking Result* 💘\n\n${nameA} ❤️ ${nameB}\nCompatibility: ${compatibility}%!\nThey make a cute couple! 💕`,
      `✨ *Potential Couple Alert* ✨\n\n${nameA} + ${nameB} = 💖\nMatch rating: ${compatibility}%`,
      `💞 *Love Connection* 💞\n\n${nameA} and ${nameB} have ${compatibility}% chemistry!\nMaybe they should go on a date? 👀`,
      `💑 *Perfect Match* 💑\n\n${nameA} ❤️ ${nameB}\nWith ${compatibility}% compatibility,\nthis could be the real deal!`,
    ];

    let result = messages[Math.floor(Math.random() * messages.length)];

    // Send with mentions
    await conn.sendMessage(
      m.chat,
      {
        text: result,
        mentions: [a, b],
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Matchmaking error:", error);
    conn.reply(m.chat, "Oops! Something went wrong with the matchmaking...", m);
  }
};

handler.help = ["matchmake", "couple", "ship"];
handler.tags = ["fun", "group"];
handler.command = /^(matchmake|couple|jadian|ship)$/i;
handler.group = true;

module.exports = handler;
