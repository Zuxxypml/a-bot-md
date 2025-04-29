// Thanks to TOXIC-DEVIL
// https://github.com/TOXIC-DEVIL

let handler = async (m, { conn, args }) => {
  // Ensure a number is provided
  if (!args || !args[0] || args.length === 0) {
    throw "❗ Please provide a phone number to scan!";
  }
  // Prevent numbers without country code
  if (args[0].startsWith("0")) {
    throw "❗ Please include the country code (no leading zero)!";
  }

  // Normalize and check WhatsApp registration
  const number = args[0].replace(/[^0-9]/g, "");
  let user = await conn.onWhatsApp(number);
  if (!user || !user.exists) {
    throw "❌ User not found!";
  }

  // Check which groups the user shares with the bot
  let sameGroupCount = 0;
  let allGroupChats = conn.chats
    .all()
    .filter((chat) => chat.jid.endsWith("g.us") && !chat.read_only);
  for (let gc of allGroupChats) {
    let participants = gc.metadata?.participants || [];
    if (participants.some((p) => p.id === user.jid)) {
      sameGroupCount++;
    }
  }

  // Check if the user is in our database
  let inDatabase = Boolean(global.db.data.users[user.jid]);

  // Build response
  const contactName = await conn.getName(user.jid);
  const plainNumber = user.jid.split("@")[0];
  const mention = "@" + plainNumber;
  const waLink = `wa.me/${plainNumber}`;

  let info = `
*Name:* ${contactName}
*Number:* ${plainNumber}
*Mention:* ${mention}
*Link:* ${waLink}
*JID:* ${user.jid}
*Business Account:* ${user.isBusiness ? "Yes" : "No"}
*In Database:* ${inDatabase ? "Yes" : "No"}
*Groups in Common:* ${sameGroupCount}
`.trim();

  // Send the info with proper mentions
  await conn.reply(m.chat, info, m, {
    contextInfo: { mentionedJid: conn.parseMention(info) },
  });
};

handler.help = ["scan <number>"];
handler.tags = ["tools"];
handler.command = /^scan$/i;

module.exports = handler;
