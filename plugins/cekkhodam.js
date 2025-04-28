let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw "*Enter your name! 😛*";

  const khodam = [
    "Avian Paint Can",
    "Rucika Pipe",
    "Tupperware Bottle",
    "Mixue Clown",
    "GIV Soap",
    "Swallow Sandal",
    "Jarjit",
    "Ijat",
    "Fizi",
    "Mail",
    "Ehsan",
    "Upin",
    "Ipin",
    "Catfish Whisker",
    "Tok Dalang",
    "Opah",
    "Alul",
    "Mr. Vinsen",
    "Maman Racing",
    "Mr. RT",
    "ETI Admin",
    "Bung Towel",
    "Wet Lumpia",
    "Sweet Martabak",
    "Tofu Meatball",
    "Gejrot Tofu",
    "Dimsum",
    "Seblak Chicken Feet",
    "Egg Roll",
    "Tahu Aci",
    "Mendoan Tempe",
    "Cat Rice",
    "Pinch Cake",
    "Sumedang Tofu",
    "Uduk Rice",
    "Ronde Drink",
    "Shrimp Crackers",
    "Cilok",
    "Cilung",
    "Cream Puff",
    "Jagung Susu Keju",
    "Macaroni Seblak",
    "Padang Satay",
    "Sour Vegetable Soup",
    "Kromboloni",
    "Pink Guinea Pig",
    "Mullet Grasshopper",
    "Orange Cat",
    "Flying Leech",
    "Paddle Pop Lion",
    "Cisewu Tiger",
    "Vario Mber",
    "Beat Mber",
    "Supra Geter",
    "Side Oil",
    "Racing Muffler",
    "Strawberry Juice",
    "Avocado Juice",
    "Shaken Avocado",
    "Kopyor Ice",
    "Orange Ice",
    "Cappuccino Grass Jelly",
    "Melon Jasjus",
    "Apple Teajus",
    "Mango Pop Ice",
    "Rock Sugar Teajus",
    "Gutter Water",
    "Dishwater",
    "Tube TV",
    "Water Faucet",
    "Pan Lid",
    "Charity Box",
    "Thermos Cap",
    "Bottle Cap",
    "Black Plastic Bag",
    "Charger Head",
    "Spare Tire",
    "Folding Chair",
    "Rocking Chair",
    "Banana Peel",
    "Madura Stall",
    "Sewer Pipe",
    "Catfish",
    "Water Tank",
    "PVC Pipe",
  ];

  const rkhodam = await getRandomItem(khodam);
  conn.reply(
    m.chat,
    `
╭━━━━°「 *Khodam Check* 」°
┃
┊• *Name:* ${text}
┃• *Khodam:* ${rkhodam}
╰═┅═━––––––๑
  `,
    m
  );
};

handler.command = handler.help = ["cekkhodam"];
handler.tags = ["fun"];
handler.premium = false;
module.exports = handler;

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
