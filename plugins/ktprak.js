const handler = async (m, { conn }) => {
  if (m.fromMe) return false;

  // Nigerian food database
  const nigerianFoods = {
    jollof: {
      responses: [
        "Jollof rice! 🇳🇬 The king of all rice dishes!",
        "Naija Jollof no dey carry last! 🔥",
        "Jollof rice with fried plantain - sweet die! 🤤",
        "Who else can beat Nigerian Jollof? Abeg answer me!",
        "Jollof matter is spiritual matter o! 🙌",
      ],
      emojis: ["🍛", "🇳🇬", "🔥", "👑", "🤤"],
    },
    "pounded yam": {
      responses: [
        "Pounded yam and egusi soup - classic combo!",
        "No be small thing to pound yam o! Strong arm needed! 💪",
        "Pounded yam with ogbono soup - heaven on earth!",
        "You wan chop pounded yam? I dey follow you o!",
        "Pounded yam no be food, na experience! 😂",
      ],
      emojis: ["🥣", "💪", "🌿", "👌", "😂"],
    },
    suya: {
      responses: [
        "Suya with extra pepper! My guy! 🌶️",
        "Nothing beats roadside suya in the evening!",
        "Suya and cold Fanta - perfect match!",
        "You dey talk about that spicy suya abi? My mouth dey water!",
        "Original Hausa suya na the real deal!",
      ],
      emojis: ["🍢", "🌶️", "🔥", "😋", "👍"],
    },
    amala: {
      responses: [
        "Amala and ewedu with assorted meat! Yoruba classic!",
        "Amala smooth like baby bottom! 😂",
        "You fit chop amala without gbegiri? Abeg how?",
        "Amala don turn to national treasure!",
        "Amala matter na serious matter o!",
      ],
      emojis: ["🍛", "😆", "👌", "💯", "🤲"],
    },
    "pepper soup": {
      responses: [
        "Pepper soup with cold beer - weekend special!",
        "That goat meat pepper soup dey call my name!",
        "Pepper soup na the original Nigerian comfort food!",
        "You wan take pepper soup clear your cold? Wise choice!",
        "Pepper soup wey dey burn mouth but you go still chop! 😂",
      ],
      emojis: ["🍲", "🌶️", "❄️", "😅", "👍"],
    },
  };

  // Detect mentioned Nigerian food
  const mentionedFood = Object.keys(nigerianFoods).find((food) =>
    new RegExp(food, "i").test(m.text)
  );

  if (mentionedFood) {
    const foodData = nigerianFoods[mentionedFood];
    const randomResponse =
      foodData.responses[Math.floor(Math.random() * foodData.responses.length)];
    const randomEmoji =
      foodData.emojis[Math.floor(Math.random() * foodData.emojis.length)];

    await conn.reply(
      m.chat,
      `${randomResponse} ${randomEmoji.repeat(3)}\n\n` +
        `_Where you wan chop this ${mentionedFood} from? Abeg recommend place!_`,
      m
    );
  }
};

// Matches common Nigerian food names and slang
handler.customPrefix =
  /jollof|pounded yam|suya|amala|pepper soup|egusi|ogbono|ewa agonyin|nkwobi|abacha/i;
handler.command = new RegExp();
handler.tags = ["fun", "naija"];
handler.help = ["nigerianfood - Reactions to popular Nigerian dishes"];

module.exports = handler;
