global.skata = {};
const { cKata, kata } = require("../lib/sambung-kata.js");

const gameInfo = `╔══「 *Word-Chain Game* 」
╟ In this game, each player must
╟ create a new word starting with
╟ the last letters of the previous word.
╚═════`;

const rulesInfo = `╔══「 *RULES* 」
╟ Answers must be base words:
║  no spaces or affixes (me-, -an, etc.).
╟ Last player standing wins
║  and earns 500 XP × number of players.
╟ Use ".skata" to join/start.
╚═════`;

const BONUS_XP = 500;

let handler = async (m, { conn, text, usedPrefix }) => {
  // Prepare a valid random starting word (3–7 letters)
  let kataStr = (await kata()).data.kata;
  let valid = (await cKata(kataStr)).status;
  while (kataStr.length < 3 || kataStr.length > 7 || !valid) {
    kataStr = (await kata()).data.kata;
    valid = (await cKata(kataStr)).status;
  }

  // "start" command to begin the game
  if (text.toLowerCase().includes("start")) {
    if (!skata[m.chat]) {
      return m.reply("You must set up the game first!");
    }
    const playerCount = Object.keys(skata[m.chat].jids).length;
    if (playerCount < 2) {
      return m.reply("Not enough players to start.");
    }
    // Initialize game state
    skata[m.chat].start = true;
    skata[m.chat].now = 0;
    skata[m.chat].length = playerCount;
    skata[m.chat].exp = Date.now() + require("ms")("20s");
    const firstJid = Object.keys(skata[m.chat].jids)[0];
    m.reply(
      `Game starting with @${firstJid.split("@")[0]}!\n` +
        `Build from: *${kataStr.toUpperCase()}*`,
      { contextInfo: { mentionedJid: [firstJid] } }
    );
    return;
  }

  // If no game exists yet, create a new waiting room
  if (!skata[m.chat]) {
    skata[m.chat] = {
      jids: { [m.sender]: kataStr },
      start: false,
    };
    m.reply("You have been added to the game queue.");
    return;
  }

  // If the user is already in queue
  if (skata[m.chat].jids[m.sender]) {
    return m.reply("You are already in the game queue.");
  }

  // Otherwise, add the user with a fresh word
  skata[m.chat].jids[m.sender] = kataStr;
  m.reply("You have been added to the game queue.");
};

// Before-hook to handle each turn
handler.before = async (m, { conn }) => {
  const room = skata[m.chat];
  if (!room || !room.start) return;

  const playerJids = Object.keys(room.jids);
  const currentIndex = room.now;
  const currentJid = playerJids[currentIndex];
  if (m.sender !== currentJid) return;

  // Check if the message contains the required prefix
  const expectedPrefix = room.jids[currentJid].toLowerCase();
  if (m.text.toLowerCase().startsWith(expectedPrefix)) {
    room.now++;
    const nextJid = playerJids[room.now % playerJids.length];
    m.reply(
      `Correct! +${BONUS_XP} XP awarded.\n` +
        `Next up: @${nextJid.split("@")[0]}`,
      { contextInfo: { mentionedJid: [nextJid] } }
    );
    global.db.data.users[m.sender].exp += BONUS_XP;
  } else {
    room.now++;
    const nextJid = playerJids[room.now % playerJids.length];
    m.reply(`Wrong answer.\nNext up: @${nextJid.split("@")[0]}`, {
      contextInfo: { mentionedJid: [nextJid] },
    });
  }
};

handler.help = ["sambungkata"];
handler.tags = ["game"];
handler.command = /^s(ambung)?kata(debug)?2$/i;
handler.group = false;

module.exports = handler;
