let handler = async (m, { conn }) => {
  const poems = [
    "*POEM:*\n\nA little child plays with stone,\nThrows it deep into a well,\nLearning happens all alone,\nIt’s for all ages as well.",

    "*POEM:*\n\nMorning time, plant the beans,\nSix grow strong, one fades away,\nDon’t go spreading people’s sins,\nEspecially while you’re fasting, okay?",

    "*POEM:*\n\nEnd of month, the paycheck lands,\nBuy ketupat, that’s the plan,\nPray and read with your own hands,\nDon’t forget zakat, fasting man!",

    "*POEM:*\n\nIt’s the last day to enroll,\nFeels like time just flies away,\nBut don’t you worry, sweet my soul,\nMy love is only yours to stay.",

    "*POEM:*\n\nA kid is tossing stones for fun,\nInto a well, deep and dark,\nLearning stops for anyone?\nNever! It's a lifelong spark.",

    "*POEM:*\n\nA thousand ducks in a lion’s den,\nOnly one has spotted skin,\nOut of all the Indonesian women,\nYou're the one I’m loving in.",

    "*POEM:*\n\nSunday morning, go to market,\nBuy some veggies, rice and snacks,\nStudy daily, don’t forget,\nKnowledge stacks and never lacks.",

    "*POEM:*\n\nHalf-cooked chicken from the street,\nBought it near the monument too.\nMy dear handsome, oh so sweet,\nI’ll be here waiting just for you.",

    "*POEM:*\n\nA small fire in the stove,\nBurns out when wood is through.\nI’ve waited long for love to prove,\nWhen will you say I love you?",

    "*POEM:*\n\nFishing early, morning breeze,\nCame back noon with fish to sell,\nWhoever learns with heart and ease,\nWill succeed in life as well.",

    "*POEM:*\n\nBuying a computer, no big fuss,\nMakes learning fun, no hesitation,\nCome on, let’s learn about fasting,\nStrength and patience in combination.",

    "*POEM:*\n\nHot sekoteng warms the chest,\nSomeone asks for just a taste.\nA handsome man? You guessed!\nMay I fall for you in haste?",
  ];

  conn.reply(m.chat, `“${conn.pickRandom(poems)}”`, m);
};

handler.help = ["poem"];
handler.tags = ["quotes"];
handler.command = /^(poem)$/i;

module.exports = handler;
