function handler(m, { text }) {
  let input = text || (m.quoted && m.quoted.text) || m.text;
  if (!input) throw "🔤 Please provide some text or reply to a message.";

  let transformed = input.replace(/[aiueo]/gi, "$&ve"); // add 've' after each vowel
  m.reply(transformed);
}

handler.help = ["purba <text>"];
handler.tags = ["fun"];
handler.command = /^purba$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.register = false;
handler.admin = false;
handler.botAdmin = false;

module.exports = handler;
