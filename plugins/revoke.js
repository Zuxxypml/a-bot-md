let handler = async (m, { conn, usedPrefix }) => {
  // Revoke the current group invite link
  const res = await conn.groupRevokeInvite(m.chat);

  // Notify in the group that the link has been reset
  await conn.reply(
    m.chat,
    "✅ Group invite link has been reset.\n\nPlease open your WhatsApp on PC and join again.",
    m
  );

  // Send the new invite link privately to the command sender
  const newLink = `https://chat.whatsapp.com/${res.code}`;
  await conn.reply(m.sender, `🔗 New Invite Link:\n${newLink}`, m);
};

handler.help = ["revoke (reset group invite link)"];
handler.tags = ["admin"];
handler.command = /^re(voke|new)(invite|link)?$/i;

handler.group = true;
handler.admin = true; // User must be an admin
handler.botAdmin = true; // Bot must be an admin

module.exports = handler;
