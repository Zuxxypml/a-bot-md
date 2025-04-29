let handler = async (m, { conn, command, text }) => {
  conn.reply(
    m.chat,
    `
*_🎐 According to the Bot's Fortune Telling.._*

The future of ${text ? text : "you"} ${pickRandom([
      "You will become a wealthy person with a harmonious family, 2 children, 4 vehicles, and 2 houses",
      "You will live a modest life with a harmonious family, 3 children, 1 vehicle, and 1 house",
      "You will struggle financially with a simple family, 1 child, no vehicle, and renting a home",
      "You will have a modest life after divorce, with 5 children, 2 vehicles, and 2 houses",
      "You will have a comfortable middle-class life with 2 children, 2 vehicles, and 1 house",
      "You will face financial difficulties after divorce, with 2 children, 1 vehicle, and 1 house",
      "You will become rich with a simple family, 1 child, 1 vehicle, and 2 houses",
      "You will have a modest but happy family with 1 child, 3 vehicles, and 1 house",
      "You will remain single with no children, no vehicle, and no property",
      "You will have a large modest family with 4 children, 1 vehicle, and 2 houses",
      "You will face family troubles with no children, 2 vehicles, and 1 house",
      "You will become extremely wealthy with a perfect family, 5 children, 7 vehicles, and 9 houses",
      "You will live in poverty with a simple family, 9 children, no vehicle, and renting a home",
      "You will be wealthy but stingy, with 2 children, 2 vehicles, and 2 houses",
      "You will be modest but stingy, with 1 child, 1 vehicle, and 1 house",
      "You will divorce and live modestly with 2 children, 1 vehicle, and renting a home",
      "You will have a peaceful modest life with 1 child, 1 vehicle, and 1 house",
      "You will have a very simple life with 11 children, 1 vehicle, and 1 house",
      "You will have twins in a modest family, with 3 vehicles and 2 houses",
      "You will have twins plus another child in a modest family, with 1 vehicle and 1 house",
    ])}
`.trim(),
    m
  );
};

handler.help = ["future"];
handler.tags = ["fun"];
handler.command = /^(future|masadepan)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = handler;
