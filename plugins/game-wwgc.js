const jimp = require("jimp");

const resize = async (image, width, height) => {
  const read = await jimp.read(image);
  const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
  return data;
};

const {
  emoji_role,
  sesi,
  playerOnGame,
  playerOnRoom,
  playerExit,
  dataPlayer,
  dataPlayerById,
  getPlayerById,
  getPlayerById2,
  killWerewolf,
  killww,
  dreamySeer,
  sorcerer,
  protectGuardian,
  roleShuffle,
  roleChanger,
  roleAmount,
  roleGenerator,
  addTimer,
  startGame,
  playerHidup,
  playerMati,
  vote,
  voteResult,
  clearAllVote,
  getWinner,
  win,
  pagi,
  malam,
  skill,
  voteStart,
  voteDone,
  voting,
  run,
  run_vote,
  run_malam,
  run_pagi,
} = require("../lib/werewolf");

let thumb =
  "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg";

let handler = async (m, { conn, command, usedPrefix, args }) => {
  const { sender, chat } = m;
  conn.werewolf = conn.werewolf ? conn.werewolf : {};
  const ww = conn.werewolf ? conn.werewolf : {};
  const data = ww[chat];
  const value = args[0];
  const target = args[1];

  // [ Create Room ]
  if (value === "create") {
    if (chat in ww) return m.reply("The group is already in a game session");
    if (playerOnGame(sender, ww) === true)
      return m.reply("You're still in a game session");
    ww[chat] = {
      room: chat,
      owner: sender,
      status: false,
      iswin: null,
      cooldown: null,
      day: 0,
      time: "night",
      player: [],
      dead: [],
      voting: false,
      seer: false,
      guardian: [],
    };
    await m.reply("Room created successfully, type *.ww join* to join");
  } else if (value === "join") {
    if (!ww[chat]) return m.reply("No game session available");
    if (ww[chat].status === true)
      return m.reply("The game session has already started");
    if (ww[chat].player.length > 16)
      return m.reply("Sorry, the maximum number of players has been reached");
    if (playerOnRoom(sender, chat, ww) === true)
      return m.reply("You've already joined this room");
    if (playerOnGame(sender, ww) === true)
      return m.reply("You're still in a game session");
    let data = {
      id: sender,
      number: ww[chat].player.length + 1,
      sesi: chat,
      status: false,
      role: false,
      effect: [],
      vote: 0,
      isdead: false,
      isvote: false,
    };
    ww[chat].player.push(data);
    let player = [];
    let text = `\n*⌂ W E R E W O L F - P L A Y E R S*\n\n`;
    for (let i = 0; i < ww[chat].player.length; i++) {
      text += `${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )}\n`;
      player.push(ww[chat].player[i].id);
    }
    text += "\nMinimum players required: 5 | Maximum: 15";
    conn.sendMessage(
      m.chat,
      {
        text: text.trim(),
        contextInfo: {
          externalAdReply: {
            title: "W E R E W O L F",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: await resize(thumb, 300, 175),
            sourceUrl: "",
            mediaUrl: thumb,
          },
          mentionedJid: player,
        },
      },
      {
        quoted: m,
      }
    );

    // [ Game Play ]
  } else if (value === "start") {
    if (!ww[chat]) return m.reply("No game session available");
    if (ww[chat].player.length === 0) return m.reply("The room has no players");
    if (ww[chat].player.length < 5)
      return m.reply("Sorry, not enough players to start");
    if (playerOnRoom(sender, chat, ww) === false)
      return m.reply("You haven't joined this room");
    if (ww[chat].cooldown > 0) {
      if (ww[chat].time === "voting") {
        clearAllVote(chat, ww);
        addTimer(chat, ww);
        return await run_vote(conn, chat, ww);
      } else if (ww[chat].time === "night") {
        clearAllVote(chat, ww);
        addTimer(chat, ww);
        return await run_malam(conn, chat, ww);
      } else if (ww[chat].time === "morning") {
        clearAllVote(chat, ww);
        addTimer(chat, ww);
        return await run_pagi(conn, chat, ww);
      }
    }
    if (ww[chat].status === true)
      return m.reply("The game session has already started");
    if (ww[chat].owner !== sender)
      return m.reply(
        `Only @${ww[chat].owner.split("@")[0]} can start the game`,
        {
          withTag: true,
        }
      );
    let list1 = "";
    let list2 = "";
    let player = [];
    roleGenerator(chat, ww);
    addTimer(chat, ww);
    startGame(chat, ww);
    for (let i = 0; i < ww[chat].player.length; i++) {
      list1 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )}\n`;
      player.push(ww[chat].player[i].id);
    }
    for (let i = 0; i < ww[chat].player.length; i++) {
      list2 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )} ${
        ww[chat].player[i].role === "werewolf" ||
        ww[chat].player[i].role === "sorcerer"
          ? `[${ww[chat].player[i].role}]`
          : ""
      }\n`;
      player.push(ww[chat].player[i].id);
    }
    for (let i = 0; i < ww[chat].player.length; i++) {
      // [ Werewolf ]
      if (ww[chat].player[i].role === "werewolf") {
        if (ww[chat].player[i].isdead != true) {
          var text = `Hello ${conn.getName(
            ww[chat].player[i].id
          )}, You've been chosen as *Werewolf* ${emoji_role(
            "werewolf"
          )} in this game. Please select a player to kill tonight\n*PLAYER LIST*:\n${list2}\n\nType *.wwpc kill number* to kill a player`;
          await conn.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }

        // [ Villager ]
      } else if (ww[chat].player[i].role === "villager") {
        if (ww[chat].player[i].isdead != true) {
          let text = `*⌂ W E R E W O L F - G A M E*\n\nHello ${conn.getName(
            ww[chat].player[i].id
          )} Your role is *Villager* ${emoji_role(
            "villager"
          )}, stay alert as the *Werewolves* might attack you tonight. Please return to your homes.\n*PLAYER LIST*:\n${list1}`;
          await conn.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }

        // [ Seer ]
      } else if (ww[chat].player[i].role === "seer") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hello ${conn.getName(
            ww[chat].player[i].id
          )} You've been chosen as the *Seer* ${emoji_role(
            "seer"
          )}. With your magic, you can reveal a player's role.\n*PLAYER LIST*:\n${list1}\n\nType *.wwpc dreamy number* to see a player's role`;

          await conn.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }

        // [ Guardian ]
      } else if (ww[chat].player[i].role === "guardian") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hello ${conn.getName(
            ww[chat].player[i].id
          )} You've been chosen as the *Guardian Angel* ${emoji_role(
            "guardian"
          )}. With your powers, you can protect the villagers. Please select one player to protect\n*PLAYER LIST*:\n${list1}\n\nType *.wwpc deff number* to protect a player`;

          await conn.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }

        // [ Sorcerer ]
      } else if (ww[chat].player[i].role === "sorcerer") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hello ${conn.getName(
            ww[chat].player[i].id
          )} You've been chosen as the *Sorcerer* ${emoji_role(
            "sorcerer"
          )}. With your powers, you can reveal a player's identity. Please select one player to investigate\n*PLAYER LIST*:\n${list2}\n\nType *.wwpc sorcerer number* to see a player's role`;

          await conn.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }
      }
    }
    await conn.sendMessage(m.chat, {
      text: "*⌂ W E R E W O L F - G A M E*\n\nThe game has started. Players will play their respective roles. Please check your private chat to see your role. Be careful villagers, tonight might be your last night.",
      contextInfo: {
        externalAdReply: {
          title: "W E R E W O L F",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnail: await resize(thumb, 300, 175),
          sourceUrl: "",
          mediaUrl: thumb,
        },
        mentionedJid: player,
      },
    });
    await run(conn, chat, ww);
  } else if (value === "vote") {
    if (!ww[chat]) return m.reply("No game session available");
    if (ww[chat].status === false)
      return m.reply("The game hasn't started yet");
    if (ww[chat].time !== "voting")
      return m.reply("Voting session hasn't started");
    if (playerOnRoom(sender, chat, ww) === false)
      return m.reply("You're not a player");
    if (dataPlayer(sender, ww).isdead === true)
      return m.reply("You're already dead");
    if (!target || target.length < 1) return m.reply("Enter player number");
    if (isNaN(target)) return m.reply("Use numbers only");
    if (dataPlayer(sender, ww).isvote === true)
      return m.reply("You've already voted");
    let b = getPlayerById(chat, sender, parseInt(target), ww);
    if (b.db.isdead === true)
      return m.reply(`Player ${target} is already dead.`);
    if (ww[chat].player.length < parseInt(target)) return m.reply("Invalid");
    if (getPlayerById(chat, sender, parseInt(target), ww) === false)
      return m.reply("Player not registered!");
    vote(chat, parseInt(target), sender, ww);
    return m.reply("✅ Vote recorded");
  } else if (value == "exit") {
    if (!ww[chat]) return m.reply("No game session available");
    if (playerOnRoom(sender, chat, ww) === false)
      return m.reply("You're not in this game session");
    if (ww[chat].status === true)
      return m.reply("Game has started, you can't exit now");
    m.reply(`@${sender.split("@")[0]} left the game`, {
      withTag: true,
    });
    playerExit(chat, sender, ww);
  } else if (value === "delete") {
    if (!ww[chat]) return m.reply("No game session available");
    if (ww[chat].owner !== sender)
      return m.reply(
        `Only @${ww[chat].owner.split("@")[0]} can delete this game session`
      );
    m.reply("Game session deleted successfully").then(() => {
      delete ww[chat];
    });
  } else if (value === "player") {
    if (!ww[chat]) return m.reply("No game session available");
    if (playerOnRoom(sender, chat, ww) === false)
      return m.reply("You're not in this game session");
    if (ww[chat].player.length === 0)
      return m.reply("No players in this game session");
    let player = [];
    let text = "\n*⌂ W E R E W O L F - G A M E*\n\nPLAYER LIST:\n";
    for (let i = 0; i < ww[chat].player.length; i++) {
      text += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )} ${
        ww[chat].player[i].isdead === true
          ? `☠️ ${ww[chat].player[i].role}`
          : ""
      }\n`;
      player.push(ww[chat].player[i].id);
    }
    conn.sendMessage(
      m.chat,
      {
        text: text,
        contextInfo: {
          externalAdReply: {
            title: "W E R E W O L F",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: await resize(thumb, 300, 175),
            sourceUrl: "",
            mediaUrl: thumb,
          },
          mentionedJid: player,
        },
      },
      {
        quoted: m,
      }
    );
  } else {
    let text = `\n*⌂ W E R E W O L F - G A M E*\n\nA social game that runs in several rounds. Players must identify the criminals in the game. Each player is given time, roles, and abilities to play the game.\n\n*⌂ C O M M A N D S*\n`;
    text += ` • ww create\n`;
    text += ` • ww join\n`;
    text += ` • ww start\n`;
    text += ` • ww exit\n`;
    text += ` • ww delete\n`;
    text += ` • ww player\n`;
    text += `\nThis game can be played by 5 to 15 players.`;
    conn.sendMessage(
      m.chat,
      {
        text: text.trim(),
        contextInfo: {
          externalAdReply: {
            title: "W E R E W O L F",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: await resize(thumb, 300, 175),
            sourceUrl: "",
            mediaUrl: thumb,
          },
        },
      },
      {
        quoted: m,
      }
    );
  }
};

handler.help = ["werewolf"].map((v) => v + " - Play the Werewolf game");
handler.tags = ["game"];
handler.command = /^(ww|werewolf)$/i;
handler.group = true;
module.exports = handler;
