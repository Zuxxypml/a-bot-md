let handler = async (m, { conn }) => {
  conn.reply(m.chat, `“${conn.pickRandom(global.spill)}”`, m);
};
handler.help = ["spill"];
handler.tags = ["fun"];
handler.command = /^spill$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = true;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;

module.exports = handler;

global.spill = [
  "Spill your favorite sticker",
  "Spill one of your friends' nicknames",
  "Spill the most innocent person you know",
  "How do you feel when your message is read but not replied?",
  "Have you ever been stuck on one person?",
  "Spill the smartest person",
  "Spill who ghosted you",
  "Spill who you pray for in the last third of the night",
  "Spill who is often a victim of fake lovers",
  "Spill the person who amazes you every time",
  "Spill who looks the youngest",
  "Spill a fake friend (tag them!)",
  "Spill what boosts your mood (tag the account!)",
  "Spill the person you keep dropping hints to but they don't notice",
  "Spill who acts like a monkey",
  "Spill the most clueless person",
  "Spill your longest ex-relationship",
  "Spill if you've ever disliked a friend",
  "Spill who often fights with their partner",
  "Spill who frequently daydreams",
  "Spill who often forgets to reply to chats",
  "Spill who causes drama",
  "Spill the curse words you use most often",
  "Spill a song that once made you cry",
  "Spill the person you wish you could hex",
  "Spill what makes it hard for you to move on",
  "Spill a task you never completed",
  "Spill your wishes for next year",
  "Spill: were you ever cheated on or did you cheat?",
  "Spill your father's name",
  "Spill someone you don't like",
  "SPILL OR DRINK (Real Life):",
  "Spill something your partner gave you",
  "Spill your favorite Indonesian song",
  "Spill your hottest friend!",
  "Spill a friend who likes to do wrong",
  "Spill the person you can't forget",
  "Spill the strictest teacher you had in elementary school",
  "Spill someone you've had a secret crush on",
  "Spill who often ignores you",
  "Spill character traits in men or women you dislike",
  "Spill who often cries because of their partner",
  "Were you cheated on or did you cheat?",
];
