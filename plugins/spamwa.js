let handler = async (m, { conn, text }) => {
  // Parse the input: number|message|count
  let [rawNumber, message, count] = text.split("|");
  const usage =
    "Usage: #spamwa number|message|count\n" +
    "Example: #spamwa 5219999999999|Hello there|50";

  // Validate inputs
  if (!rawNumber) throw usage;
  if (!message) throw usage;
  if (count && isNaN(count)) throw usage;

  // Clean up and format the WhatsApp JID
  let targetJid =
    rawNumber
      .replace(/[-+<>@]/g, "")
      .replace(/\s+/g, "")
      .replace(/^0/, "62") + "@s.whatsapp.net";

  // Default to 10 messages if count not provided
  let total = count ? parseInt(count) : 10;
  if (total > 50) throw "*Maximum 50 messages allowed.*";

  // Inform the user
  await m.reply(
    `✅ Spam will be sent to ${rawNumber}\n` + `Total messages: *${total}*`
  );

  // Send the spam messages
  for (let i = 0; i < total; i++) {
    const numberedText = `${message.trim()}\n\n[${i + 1}/${total}]`;
    await conn.relayMessage(targetJid, { text: numberedText }, {});
  }
};

handler.help = ["spamwa <number>|<message>|<count>"];
handler.tags = ["tools", "premium"];
handler.command = /^spamwa$/i;

handler.group = false;
handler.premium = true;
handler.private = true;
handler.limit = true;

module.exports = handler;
