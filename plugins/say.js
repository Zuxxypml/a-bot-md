let handler = async (m, { text }) => {
  if (!text) text = m.text;
  m.reply(text);
};

handler.help = ["say <text>"];
handler.tags = ["fun"];
handler.command = /^(say)$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;

handler.fail = null;

module.exports = handler;
