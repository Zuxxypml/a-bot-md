const PhoneNumber = require("awesome-phonenumber");
const fetch = require("node-fetch");

let handler = async (m, { conn, text, command }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender;
  let name = conn.getName(who);

  switch (command) {
    case "stupidcheck":
    case "uglycheck":
    case "gaycheck":
    case "rate":
    case "lesbiancheck":
    case "handsomecheck":
    case "prettycheck":
    case "dumbcheck":
    case "mastercheck":
    case "smartcheck":
    case "procheck":
    case "nolifecheck":
    case "pigcheck":
    case "burdencheck":
    case "goodcheck":
    case "evilcheck":
    case "dogcheck":
    case "haramcheck":
    case "playboycheck":
    case "playgirlcheck":
    case "pervycheck":
    case "sensitivecheck":
    case "fakeboycheck":
    case "religiouscheck":
    case "fakegirlcheck":
    case "coolcheck":
    case "weebcheck":
    case "markettrashcheck":
    case "streetkidcheck":
    case "checkstupid":
    case "checkugly":
    case "checkgay":
    case "checklesbian":
    case "checkhandsome":
    case "checkpretty":
    case "checkdumb":
    case "checkmaster":
    case "checksmart":
    case "checkpro":
    case "checknolife":
    case "checkpig":
    case "checkburden":
    case "checkgood":
    case "checkevil":
    case "checkdog":
    case "checkharam":
    case "checkplayboy":
    case "checkplaygirl":
    case "checkpervy":
    case "checksensitive":
    case "checkfakeboy":
    case "checkreligious":
    case "checkfakegirl":
    case "checkcool":
    case "checkweeb":
    case "checkmarkettrash":
    case "checkstreetkid": {
      const percentage =
        randomPercentage[Math.floor(Math.random() * randomPercentage.length)];
      conn.sendMessage(
        m.chat,
        {
          text: `Question: *${command}*\nName: @${
            m.sender.split("@")[0]
          }\nResult: ${percentage}%`,
          mentions: [m.sender],
        },
        { quoted: m }
      );
      break;
    }
  }
};

handler.tags = ["fun"];
handler.help = handler.command = [
  "stupidcheck",
  "uglycheck",
  "gaycheck",
  "rate",
  "lesbiancheck",
  "handsomecheck",
  "prettycheck",
  "dumbcheck",
  "mastercheck",
  "smartcheck",
  "procheck",
  "nolifecheck",
  "pigcheck",
  "burdencheck",
  "goodcheck",
  "evilcheck",
  "dogcheck",
  "haramcheck",
  "playboycheck",
  "playgirlcheck",
  "pervycheck",
  "sensitivecheck",
  "fakeboycheck",
  "religiouscheck",
  "fakegirlcheck",
  "coolcheck",
  "weebcheck",
  "markettrashcheck",
  "streetkidcheck",
  "checkstupid",
  "checkugly",
  "checkgay",
  "checklesbian",
  "checkhandsome",
  "checkpretty",
  "checkdumb",
  "checkmaster",
  "checksmart",
  "checkpro",
  "checknolife",
  "checkpig",
  "checkburden",
  "checkgood",
  "checkevil",
  "checkdog",
  "checkharam",
  "checkplayboy",
  "checkplaygirl",
  "checkpervy",
  "checksensitive",
  "checkfakeboy",
  "checkreligious",
  "checkfakegirl",
  "checkcool",
  "checkweeb",
  "checkmarkettrash",
  "checkstreetkid",
];

module.exports = handler;

// Random % list
global.randomPercentage = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
