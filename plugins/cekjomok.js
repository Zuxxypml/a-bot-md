let handler = async (m, { conn }) => {
  conn.reply(m.chat, `"${pickRandom(global.jomok)}"`, m);
};

handler.help = ["jomokcek"];
handler.tags = ["fun"];
handler.command = /^(jomokcek)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.limit = false;

module.exports = handler;

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

global.jomok = [
  "Jomok Level: 4%\n\nYou’re safe, bro! 😘",
  "Jomok Level: 7%\n\nNot bad, mate! 😋",
  "Jomok Level: 12%\n\nBeware, potential demon king! 😲",
  "Jomok Level: 22%\n\nOh no, trouble! 🥺",
  "Jomok Level: 27%\n\nA bit jomok! 🤭",
  "Jomok Level: 35%\n\nQuarter jomok! 😱",
  "Jomok Level: 41%\n\nDanger zone, dude! 🤯",
  "Jomok Level: 48%\n\nHalfway to jomok! 😔",
  "Jomok Level: 56%\n\nYou’re jomok too! 😫",
  "Jomok Level: 64%\n\nDang, future catfish whiskers! 🤨",
  "Jomok Level: 71%\n\nWhoa, watch out! 😂",
  "Jomok Level: 1%\n\n99% just slow, lol! 😅",
  "Jomok Level: 77%\n\nThis guy’s a serious contender! 🤣",
  "Jomok Level: 83%\n\nBeware, dark side alert! 😋",
  "Jomok Level: 89%\n\nSuper jomok, wow! 😆",
  "Jomok Level: 94%\n\nREPENT NOW, YOUR JOMOK LEVEL IS OVER THE LIMIT! 😂",
  "Jomok Level: 100%\n\nYOU’RE THE ULTIMATE JOMOK! 🤗",
  "Jomok Level: 100%\n\nYOU’RE A LOVER OF DARK HOLES, DUDE! 🤩",
  "Jomok Level: 100%\n\nYOU’RE THE DEMON KING! 🥵",
  "Jomok Level: 100%\n\nTHIS GUY’S JOMOK LEVEL IS BEYOND SAVING! 🥰",
];
