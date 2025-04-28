let handler = async (m, { command, text }) => {
  let txt = text || (m.quoted && m.quoted.text) || false;
  if (!txt) throw `Please input text to encode.`;

  let encoded = Buffer.from(txt, "utf-8").toString("base64");
  m.reply(encoded);
};

handler.help = ["base64 <text>"];
handler.tags = ["tools"];
handler.command = /^base64$/i;

module.exports = handler;
