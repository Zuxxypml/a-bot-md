let handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, "Enter the name, idiot!", m);

  conn.reply(
    m.chat,
    `
╭━━━━°「 *Vagina Check ${text}* 」°
┃
┊• Name: ${text}
┃• Vagina: ${pickRandom([
      "Ugh, dark",
      "Spotted lol",
      "Smooth",
      "White and smooth",
      "Matte black",
      "Pink wow",
      "Glossy black",
    ])}
┊• Hole: ${pickRandom([
      "Virgin",
      "Not a virgin",
      "Has been used",
      "Still tight",
      "Plump",
    ])}
┃• Pubes: ${pickRandom(["Thick", "A little bit", "None", "Thin", "Smooth"])}
╰═┅═━––––––๑
`.trim(),
    m
  );
};

handler.help = ["cekmemek <nama>"];
handler.tags = ["fun"];
handler.command = /^cekmemek/i;
handler.premium = false;
handler.limit = false;

module.exports = handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
