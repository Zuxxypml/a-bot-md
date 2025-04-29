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
} = require("../lib/werewolf.js");

let handler = async (m, { conn, command, usedPrefix, args }) => {
  let { sender, chat } = m;
  conn.werewolf = conn.werewolf ? conn.werewolf : {};
  let ww = conn.werewolf;
  let value = (args[0] || "").toLowerCase();
  let target = args[1];

  if (playerOnGame(sender, ww) === false)
    return m.reply("You're not in a game session");
  if (dataPlayer(sender, ww).status === true)
    return m.reply(
      "Skill already used. You can only use your skill once per night"
    );
  if (dataPlayer(sender, ww).isdead === true)
    return m.reply("You're already dead");
  if (!target || target.length < 1 || target.split("").length > 2)
    return m.reply(
      `Enter player number\nExample:\n${usedPrefix + command} kill 1`
    );
  if (isNaN(target)) return m.reply("Please use numbers only");
  let byId = getPlayerById2(sender, parseInt(target), ww);
  if (byId.db.isdead === true) return m.reply("This player is already dead");
  if (byId.db.id === sender) return m.reply("You can't use skills on yourself");
  if (byId === false) return m.reply("Player not registered");

  if (value === "kill") {
    if (dataPlayer(sender, ww).role !== "werewolf")
      return m.reply("This role isn't for you");

    if (byId.db.role === "sorcerer")
      return m.reply("You can't use skills on your ally");

    return m
      .reply("Successfully killed player " + parseInt(target))
      .then(() => {
        dataPlayer(sender, ww).status = true;
        killWerewolf(sender, parseInt(target), ww);
      });
  } else if (value === "dreamy") {
    if (dataPlayer(sender, ww).role !== "seer")
      return m.reply("This role isn't for you");

    let dreamy = dreamySeer(sender, parseInt(target), ww);
    return m
      .reply(`Successfully revealed player ${target}'s identity: ${dreamy}`)
      .then(() => {
        dataPlayer(sender, ww).status = true;
      });
  } else if (value === "deff") {
    if (dataPlayer(sender, ww).role !== "guardian")
      return m.reply("This role isn't for you");

    return m.reply(`Successfully protected player ${target}`).then(() => {
      protectGuardian(sender, parseInt(target), ww);
      dataPlayer(sender, ww).status = true;
    });
  } else if (value === "sorcerer") {
    if (dataPlayer(sender, ww).role !== "sorcerer")
      return m.reply("This role isn't for you");

    let sorker = sorcerer(sender, parseInt(target), ww);
    return m
      .reply(`Successfully revealed player ${target}'s identity: ${sorker}`)
      .then(() => {
        dataPlayer(sender, ww).status = true;
      });
  }
};

handler.command = /^((ww|werewolf)pc)$/i;
handler.private = true;
module.exports = handler;
