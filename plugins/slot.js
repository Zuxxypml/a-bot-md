const db = require("../lib/database.js");
//const fs = require('fs')
//hoy
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let fa = `
masukan jumlah xp taruhan?

📌 example:
*${usedPrefix + command}* 100`.trim();
  if (!args[0]) throw fa;
  if (isNaN(args[0])) throw fa;
  let apuesta = parseInt(args[0]);
  let users = global.db.data.users[m.sender];
  let time = users.lastslot + 10000;
  if (new Date() - users.lastslot < 10000)
    throw `⏳ Espere ${msToTime(time - new Date())}`;
  if (apuesta < 100) throw "✳️ Taruhan minimum adalah *100 XP*";
  if (users.exp < apuesta) {
    throw `✳️ *XP* Anda tidak cukup`;
  }

  let emojis = ["🐋", "🐉", "🕊️"];
  let a = Math.floor(Math.random() * emojis.length);
  let b = Math.floor(Math.random() * emojis.length);
  let c = Math.floor(Math.random() * emojis.length);
  let x = [],
    y = [],
    z = [];
  for (let i = 0; i < 3; i++) {
    x[i] = emojis[a];
    a++;
    if (a == emojis.length) a = 0;
  }
  for (let i = 0; i < 3; i++) {
    y[i] = emojis[b];
    b++;
    if (b == emojis.length) b = 0;
  }
  for (let i = 0; i < 3; i++) {
    z[i] = emojis[c];
    c++;
    if (c == emojis.length) c = 0;
  }
  let end;
  if (a == b && b == c) {
    end = `Menang 🎁   *+${apuesta + apuesta} XP*`;
    users.exp += apuesta;
  } else if (a == b || a == c || b == c) {
    end = `🔮 Anda hampir berhasil, teruslah mencoba :) \nMiliki *+10 XP*`;
    users.exp += 10;
  } else {
    end = `Kamu kalah  *-${apuesta} XP*`;
    users.exp -= apuesta;
  }
  users.lastslot = new Date() * 1;
  let name = await conn.getName(m.sender);
  let fakemsg = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(false ? { remoteJid: "17608914335-1625305606@g.us" } : {}),
    },
    message: {
      extendedTextMessage: { text: `${end}\n• ${name}`, title: "Elaina-MD" },
    },
  };
  return await conn.reply(
    m.chat,
    `
  🎰 | *SLOTS* 
──────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────── `,
    fakemsg
  );
};
handler.help = ["slot *<jumlah>*"];
handler.tags = ["game"];
handler.command = /^(slot)$/i;
//handler.register = trueconst db = require('../lib/database.js');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const usage = `
Please enter the amount of XP to wager.

Example:
*${usedPrefix + command} 100*
`.trim();
  // Validate input
  if (!args[0] || isNaN(args[0])) throw usage;
  const bet = parseInt(args[0], 10);
  const user = global.db.data.users[m.sender];

  // Enforce 10-second cooldown
  const nextAvailable = user.lastslot + 10000;
  if (Date.now() < nextAvailable) {
    throw `⏳ Please wait ${msToTime(
      nextAvailable - Date.now()
    )} before playing again.`;
  }

  // Minimum bet and balance check
  if (bet < 100) throw "✳️ Minimum bet is *100 XP*";
  if (user.exp < bet) throw "✳️ You do not have enough XP to cover that bet.";

  // Slot symbols
  const symbols = ["🐋", "🐉", "🕊️"];
  // Generate three rows of three symbols each, cycling through the array
  let a = Math.floor(Math.random() * symbols.length);
  let b = Math.floor(Math.random() * symbols.length);
  let c = Math.floor(Math.random() * symbols.length);

  const row1 = [
    symbols[a],
    symbols[(a + 1) % symbols.length],
    symbols[(a + 2) % symbols.length],
  ];
  const row2 = [
    symbols[b],
    symbols[(b + 1) % symbols.length],
    symbols[(b + 2) % symbols.length],
  ];
  const row3 = [
    symbols[c],
    symbols[(c + 1) % symbols.length],
    symbols[(c + 2) % symbols.length],
  ];

  let resultMessage;
  // Determine result
  if (a === b && b === c) {
    // Jackpot: all three align
    resultMessage = `🎉 You hit the jackpot!\nYou win *+${bet * 2} XP*`;
    user.exp += bet; // net gain: bet XP (you get back your bet + same amount)
  } else if (a === b || b === c || a === c) {
    // Two in a row
    resultMessage = `🔮 So close! Keep trying.\nYou earn *+10 XP*`;
    user.exp += 10;
  } else {
    // No match
    resultMessage = `💔 You lost *-${bet} XP*`;
    user.exp -= bet;
  }

  // Update last play time
  user.lastslot = Date.now();

  // Prepare display
  const name = await conn.getName(m.sender);
  const fakeContext = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
    },
    message: {
      extendedTextMessage: {
        text: `${resultMessage}\nPlayer: ${name}`,
        title: "🎰 Slots Game 🎰",
      },
    },
  };

  // Send the slot machine display
  return conn.reply(
    m.chat,
    `🎰 | *SLOTS MACHINE*\n` +
      `──────────\n` +
      `${row1.join(" : ")}\n` +
      `${row2.join(" : ")}\n` +
      `${row3.join(" : ")}\n` +
      `──────────`,
    fakeContext
  );
};

handler.help = ["slot <amount>"];
handler.tags = ["game"];
handler.command = /^slot$/i;

module.exports = handler;

// Helper: format milliseconds into "MM m SS s"
function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((duration / 60000) % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes} m ${seconds} s`;
}

module.exports = handler;

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + " m " + seconds + " s ";
}
