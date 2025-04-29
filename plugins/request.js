let handler = async (m, { conn, text }) => {
  // Require the user to provide their request
  if (!text) {
    return conn.reply(m.chat, "❗ Please enter your request.", m);
  }

  // Send the request to the bot owner
  const ownerJid = global.owner[0] + "@s.whatsapp.net";
  conn.fakeReply(
    ownerJid,
    `*[REQUEST]*\nMessage: ${text}`,
    m.sender,
    m.text,
    m.chat
  );

  // Acknowledge back to the user
  await conn.reply(
    m.chat,
    "_Your feature request has been sent to the bot owner._",
    m
  );
};

handler.help = ["request <your message>"];
handler.tags = ["main"];
handler.command = /^req(uest)?$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;

// Disable default failure message
handler.fail = null;

module.exports = handler;
