let handler = async (m, { conn }) => {
  const userData = global.db.data.users[m.sender];
  const partnerJid = userData.pasangan;

  // If the user hasn't confessed to anyone
  if (!partnerJid) {
    return conn.reply(m.chat, "You haven't confessed to anyone!", m);
  }

  const partnerData = global.db.data.users[partnerJid];

  // If the partner reciprocated
  if (partnerData.pasangan === m.sender) {
    return conn.reply(
      m.chat,
      `You are now dating @${partnerJid.split("@")[0]}`,
      m,
      { contextInfo: { mentionedJid: [partnerJid] } }
    );
  }

  // Otherwise, let go of the unreciprocated confession
  conn.reply(
    m.chat,
    `You have let go of @${
      partnerJid.split("@")[0]
    } because they didn't respond (accept or reject).`,
    m,
    { contextInfo: { mentionedJid: [partnerJid] } }
  );

  // Clear the confession record
  userData.pasangan = "";
};

handler.help = ["letgo"];
handler.tags = ["fun"];
handler.command = /^(simikhlas|letgo)$/i;
handler.mods = false;
handler.premium = false;
handler.group = true;
handler.fail = null;
handler.register = true;

module.exports = handler;
