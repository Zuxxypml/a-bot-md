const linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text }) => {
  try {
    // Extract link from message or quoted message
    let txt = text ? text : m.quoted?.text || false;
    if (!txt) throw "Please provide or quote a WhatsApp group link";

    let [, code] = txt.match(linkRegex) || [];
    if (!code) throw "Invalid WhatsApp group link format";

    // Fetch group information
    let res = await conn
      .query({
        json: ["query", "invite", code],
        expect200: true,
      })
      .catch((e) => {
        console.error("Inspection error:", e);
        throw "Failed to fetch group information";
      });

    if (!res) throw "No response received from server";

    // Format group information
    let creationDate = formatDate(res.creation * 1000);
    let participantsList =
      res.participants
        ?.map(
          (user, i) =>
            `${i + 1}. @${user.id.split("@")[0]} (${user.id.split("@")[0]})`
        )
        .join("\n") || "No known participants";

    let caption = `
🔍 *Group Link Inspector* 🔍

*🔗 Group ID:* ${res.id}
*📛 Title:* ${res.subject || "No title"}
*🛠️ Created by:* @${res.id.split("-")[0]} 
*⏰ Creation Date:* ${creationDate}

${
  res.subjectOwner
    ? `*✏️ Title changed by:* @${res.subjectOwner.split("@")[0]} 
*🕒 Last changed:* ${formatDate(res.subjectTime * 1000)}\n`
    : ""
}
${
  res.descOwner
    ? `*📝 Description changed by:* @${res.descOwner.split("@")[0]} 
*🕒 Last changed:* ${formatDate(res.descTime * 1000)}\n`
    : ""
}

*👥 Members:*
• Total: ${res.size}
• Known participants:\n${participantsList}

${
  res.desc
    ? `*📄 Description:*
${res.desc}\n`
    : "*No description available*\n"
}

*📊 Raw Data:*
\`\`\`json
${JSON.stringify(res, null, 2)}
\`\`\`
`.trim();

    // Try to get group profile picture
    let pp = await conn.profilePictureUrl(res.id).catch(() => null);
    if (pp) {
      await conn.sendFile(m.chat, pp, "group.jpg", caption, m, false, {
        mentions: conn.parseMention(caption),
        asDocument: true,
      });
    } else {
      await m.reply(caption, null, {
        mentions: conn.parseMention(caption),
      });
    }
  } catch (error) {
    console.error("Inspection error:", error);
    await m.reply(`❌ Error: ${error.message || error}`);
  }
};

handler.help = ["inspect <link>", "checkgroup <link>"];
handler.tags = ["tools", "group"];
handler.command = /^(inspect|checkgroup|grouplinkinfo)$/i;

module.exports = handler;

function formatDate(timestamp, locale = "en-US") {
  return new Date(timestamp).toLocaleString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
