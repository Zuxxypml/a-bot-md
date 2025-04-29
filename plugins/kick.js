const handler = async (
  m,
  { conn, args, isOwner, isAdmin, isBotAdmin, usedPrefix, command }
) => {
  // Check if bot is admin first
  if (!isBotAdmin) {
    return conn.reply(
      m.chat,
      "❌ Abeg make you add me as admin first before I fit do this action",
      m
    );
  }

  // Check user admin status
  if (!isAdmin && !isOwner) {
    return conn.reply(
      m.chat,
      "❌ Oga you no be admin here, you no get power to kick people",
      m
    );
  }

  const ownerGroup = m.chat.split("-")[0] + "@s.whatsapp.net";
  let users = [];

  // Get mentioned users or quoted user
  if (m.mentionedJid) {
    users = m.mentionedJid.filter(
      (u) => !(u === ownerGroup || u.includes(conn.user.jid))
    );
  } else if (m.quoted?.sender) {
    users = [m.quoted.sender];
  }

  // Validate targets
  if (users.length === 0) {
    return conn.reply(
      m.chat,
      `⚠️ Oga you never tag anybody!\n\n` +
        `How to use this command:\n` +
        `• Tag person: ${usedPrefix}kick @person\n` +
        `• Reply message: ${usedPrefix}kick\n\n` +
        `Make sure you tag or reply to who you wan kick`,
      m
    );
  }

  try {
    // Remove users
    await conn.groupParticipantsUpdate(m.chat, users, "remove");

    // Nigerian-style success message
    let successMsg =
      `✅ Oya don do!\n` +
      `I don show ${
        users.length > 1 ? "these people" : "this person"
      } the door:\n` +
      users.map((u) => `• @${u.split("@")[0]}`).join("\n") +
      `\n\nNo dulling for this group again o!`;

    await conn.reply(m.chat, successMsg, m, {
      mentions: users,
    });
  } catch (error) {
    console.error("Kick error:", error);
    conn.reply(
      m.chat,
      `❌ Chai! I no fit kick person(s)\n\n` +
        `Why e happen:\n` +
        `- Person don leave group already\n` +
        `- Na admin you wan kick? No be me go do that one\n` +
        `- Network wahala\n` +
        `- Or maybe na God no gree`,
      m
    );
  }
};

handler.help = ["kick @user"];
handler.tags = ["group", "admin"];
handler.command = /^(kick|comot|remove|waka)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

module.exports = handler;
