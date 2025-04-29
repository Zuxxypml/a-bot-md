let handler = async (m, { conn, participants, groupMetadata }) => {
  // Try to get group profile picture, fallback to default
  let pp = "./src/avatar_contact.png";
  try {
    pp = await conn.profilePictureUrl(m.chat, "image");
  } catch (e) {
    console.error("Failed to fetch group picture:", e);
  }

  // Get group settings from database
  let chat = global.db.data.chats[m.chat] || {};
  let {
    isBanned,
    welcome,
    detect,
    sWelcome,
    sBye,
    sPromote,
    sDemote,
    antiLink,
    stiker,
    game,
    delete: del,
    viewonce,
    gcdate,
  } = chat;

  // Process group admins
  const groupAdmins = participants.filter((p) => p.admin).map((p) => p.id);
  const owner = groupMetadata.owner || m.chat.split("-")[0] + "@s.whatsapp.net";
  const ownernya = [owner];

  // Format admin list
  let listAdmin = groupAdmins
    .map((v, i) => {
      let username = conn.getName(v) || `Admin ${i + 1}`;
      return `${i + 1}. @${v.split("@")[0]} (${username})`;
    })
    .join("\n");

  // Calculate group expiration if available
  let expirationText = "Not set";
  if (gcdate) {
    const remainingTime = gcdate - Date.now();
    expirationText =
      remainingTime > 0 ? conn.msToDate(remainingTime) : "Expired";
  }

  // Compose group information
  let text = `
*🏷️ Group Name:* ${groupMetadata.subject}
*🆔 Group ID:* ${groupMetadata.id}
*👥 Members:* ${participants.length} participants

*📝 Description:*
${groupMetadata.desc || "No description"}

*👑 Owner:* @${owner.split("@")[0]}
*🛡️ Admins (${groupAdmins.length}):*
${listAdmin}

*⚙️ Group Settings:*
${settingStatus("Banned", isBanned)}
${settingStatus("Welcome", welcome)}
${settingStatus("Detect", detect)}
${settingStatus("Anti-Delete", !del)}
${settingStatus("Anti-Link", antiLink)}
${settingStatus("Anti-ViewOnce", viewonce)}
${settingStatus("Auto-Sticker", stiker)}
${settingStatus("Game Feature", game)}

*💬 Custom Messages:*
• Welcome: ${sWelcome || "Default"}
• Goodbye: ${sBye || "Default"}
• Promotion: ${sPromote || "Default"}
• Demotion: ${sDemote || "Default"}

*⏳ Group Expiration:* ${expirationText}
`.trim();

  // Send message with group picture
  await conn.sendFile(m.chat, pp, "group.jpg", text, m, false, {
    contextInfo: {
      mentionedJid: [...groupAdmins, ...ownernya],
      forwardingScore: 999,
      isForwarded: true,
    },
  });
};

// Helper function for status display
function settingStatus(name, value) {
  return `• ${name}: ${value ? "✅ Enabled" : "❌ Disabled"}\n`;
}

handler.help = ["groupinfo", "infogroup", "gcinfo"];
handler.tags = ["group", "tools"];
handler.command = /^(gro?upinfo|info(gro?up|gc)|gcinfo)$/i;
handler.group = true;

module.exports = handler;
