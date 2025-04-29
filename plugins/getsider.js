const handler = async (m, { conn }) => {
  if (!m.quoted) throw "Please reply to a message!";
  if (!m.quoted.fromMe) throw "Only works for messages sent by the bot";
  if (!m.quoted.id) throw "Invalid message ID";

  try {
    // Get message metadata
    const isGroup = m.quoted.chat.endsWith("g.us");
    const isBroadcast = m.quoted.chat.endsWith("@broadcast");

    let memberCount = 1;
    if (isGroup) {
      const groupData = await conn
        .groupMetadata(m.quoted.chat)
        .catch((_) => null);
      memberCount = groupData ? groupData.participants.length - 1 : 0;
    } else if (isBroadcast) {
      memberCount = -1; // Broadcast lists have dynamic size
    }

    const { reads, deliveries } = await conn.messageInfo(
      m.quoted.chat,
      m.quoted.id
    );

    // Format read receipts
    const readList =
      reads
        .sort((a, b) => b.t - a.t)
        .map(
          ({ jid, t }) => `• @${jid.split("@")[0]} (${formatDate(t * 1000)})`
        )
        .join("\n") || "No reads yet";

    // Format delivery receipts
    const deliveryList =
      deliveries
        .sort((a, b) => b.t - a.t)
        .map(
          ({ jid, t }) =>
            `• wa.me/${jid.split("@")[0]} (${formatDate(t * 1000)})`
        )
        .join("\n") || "No deliveries yet";

    // Calculate remaining
    const remainingReads =
      memberCount > 1 ? `\n📊 ${memberCount - reads.length} remaining` : "";
    const remainingDeliveries =
      memberCount > 1
        ? `\n📊 ${memberCount - reads.length - deliveries.length} remaining`
        : "";

    const report = `
📨 *Message Status Report*
      
👀 *Read by:*
${readList}${remainingReads}
      
✅ *Delivered to:*
${deliveryList}${remainingDeliveries}
    `.trim();

    await conn.reply(m.chat, report, m, {
      mentions: conn.parseMention(report),
    });
  } catch (error) {
    console.error("Read Receipt Error:", error);
    throw "Failed to get message status. The message may be too old or deleted.";
  }
};

handler.help = ["getsider - Check who read your message"];
handler.tags = ["tools", "group"];
handler.command = /^getsider$/i;

function formatDate(timestamp, locale = "en-US") {
  return new Date(timestamp).toLocaleString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

module.exports = handler;
