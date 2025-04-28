let handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, "Enter the name, idiot!", m);

  conn.reply(
    m.chat,
    `
*––––––『 DICK CHECK 』––––––*
• Name: ${text}
• Dick: ${pickRandom([
      "Ugh, dark",
      "Spotted lol",
      "Smooth",
      "White and smooth",
      "Matte black",
      "Pink wow",
      "Glossy black",
    ])}
• Status: ${pickRandom([
      "Virgin",
      "Not a virgin",
      "Has been used",
      "Still original",
      "Jumbo",
    ])}
• Pubes: ${pickRandom(["Thick", "A little bit", "None", "Thin", "Smooth"])}
`.trim(),
    m
  );
};

handler.help = ["cekkontol <nama>"];
handler.tags = ["fun"];
handler.command = /^cekkontol/i;
handler.premium = false;

module.exports = handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
