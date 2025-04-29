let handler = async (m, { conn, isOwner, isAdmin }) => {
  // Ensure user is admin or owner
  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    throw false;
  }

  const users = m.mentionedJid;

  if (!users.length) {
    throw "⚠️ Please mention a user to promote.\n\nExample: @user";
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, users, "promote"); // promote mentioned users
    await m.reply(
      `✅ Successfully promoted:\n${users
        .map((u) => `@${u.split("@")[0]}`)
        .join("\n")}`,
      null,
      {
        mentions: users,
      }
    );
  } catch (e) {
    console.error(e);
    throw "❌ Failed to promote user. Make sure I am an admin.";
  }
};

handler.help = ["promote @user"];
handler.tags = ["admin"];
handler.command = /^(promote|admin|\^|↑)$/i;

handler.group = true;
handler.botAdmin = true; // bot must be admin
handler.fail = null;

module.exports = handler;
