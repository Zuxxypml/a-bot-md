const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verify owner-only access
  if (!global.owner.includes(m.sender)) {
    return m.reply("🚫 This command is restricted to bot owners only");
  }

  // Check for valid WhatsApp invite link
  if (!args[0]) {
    const exampleLink = "https://chat.whatsapp.com/EXAMPLE12345";
    return m.reply(
      `🔗 *Group Join Command*\n\n` +
        `Please provide a valid WhatsApp group invite link\n\n` +
        `Usage: *${usedPrefix}${command} ${exampleLink}*\n` +
        `Example: *${usedPrefix}${command} https://chat.whatsapp.com/EXAMPLE12345*`
    );
  }

  const link = args[0].trim();
  const regexLink = /^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9_-]{22})$/;
  const linkMatch = link.match(regexLink);

  if (!linkMatch) {
    return m.reply(
      "❌ Invalid WhatsApp group invite link format\n\n" +
        "A valid link should look like:\n" +
        "https://chat.whatsapp.com/ABC123DEF456GHI789JKL0"
    );
  }

  const inviteCode = linkMatch[1];

  try {
    // Attempt to join group
    await conn.reply(m.chat, "⏳ Attempting to join group...", m);
    const result = await conn.groupAcceptInvite(inviteCode);

    // Success response
    await conn.reply(
      m.chat,
      `✅ *Successfully joined group!*\n\n` +
        `Group ID: ${result.gid}\n` +
        `Invite Code: ${inviteCode}\n\n` +
        `The bot will now be available in the group.`,
      m
    );
  } catch (error) {
    console.error("Group join error:", error);

    // Handle specific error cases
    let errorMessage = "❌ Failed to join group\n\n";
    if (error.message.includes("rejected")) {
      errorMessage +=
        "The invite link was rejected (may be expired or invalid)";
    } else if (error.message.includes("banned")) {
      errorMessage += "The bot is banned from this group";
    } else if (error.message.includes("full")) {
      errorMessage += "The group is full (256 members limit reached)";
    } else {
      errorMessage +=
        "Possible reasons:\n" +
        "- Invalid or expired invite link\n" +
        "- Bot was previously removed\n" +
        "- Group is full\n" +
        "- Server error";
    }

    await conn.reply(m.chat, errorMessage, m);
  }
};

handler.help = ["join <link>"];
handler.tags = ["group", "owner"];
handler.command = /^(join|joingroup)$/i;
handler.owner = true;
handler.limit = true;

module.exports = handler;
