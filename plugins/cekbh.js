let handler = async (m, { conn, text }) => {
  if (!text) throw "Please enter a name!\n\nExample: .cekbh owner";

  const sizes = [
    "flat",
    "30",
    "32A",
    "32B",
    "32C",
    "34A",
    "34B",
    "34C",
    "36A",
    "36B",
    "36C",
    "38A",
    "38B",
    "38C",
    "40A",
    "40B",
    "40C",
    "42A",
    "42B",
    "42C",
  ];
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Black",
    "White",
    "Orange",
    "Purple",
    "Brown",
    "Gray",
    "Pink",
    "Light Blue",
    "Light Green",
    "Cream",
    "Dark Blue",
    "Dark Green",
    "Sky Blue",
    "Turquoise",
    "Salmon",
    "Gold",
    "Silver",
    "Magenta",
    "Cyan",
    "Olive",
    "Navy",
    "Transparent",
  ];
  const shapes = [
    "Underwired",
    "Push-up",
    "Balconette",
    "Padded",
    "Halter",
    "Bikini",
    "Bralette",
    "Sport",
    "Tube",
    "Bridal",
    "T-brief",
    "T-shirt",
    "Multiway",
    "Midi",
    "Maxi",
    "Not Wearing",
    "Nursing",
    "Cheeky",
    "Brazilian",
    "Cutaway",
    "Halter",
  ];

  const randomSize = await getRandomItem(sizes);
  const randomColor = await getRandomItem(colors);
  const randomShape = await getRandomItem(shapes);

  conn.reply(
    m.chat,
    `👙 ${text}'s bra details:\n\n• Size: ${randomSize}\n• Color: ${randomColor}\n• Style: ${randomShape}`,
    m
  );
};

handler.help = handler.command = ["cekbh"];
handler.tags = ["fun"];

module.exports = handler;

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
