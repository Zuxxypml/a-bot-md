let handler = async (m, { conn, text, command }) => {
  if (!text) throw `Please enter some text!\nExample: .${command} friend`;

  let response;
  switch (command) {
    case "hug":
      response = `Sending warm virtual hugs to ${text}! 🤗 *hug* *hug* *hug*`;
      break;
    case "compliment":
      response = `Everyone, let's appreciate how awesome ${text} is! ✨ ${text} is amazing at being themselves!`;
      break;
    case "cheer":
      response = `You got this, ${text}! 💪 Keep going! We believe in you! ${text} ${text} ${text}!!!`;
      break;
    case "story":
      response = `Once upon a time, ${text} went on an epic adventure... They made new friends, discovered hidden treasures, and returned home with amazing stories to tell! The end. 📖`;
      break;
    case "celebrate":
      response = `🎉 CONGRATULATIONS ${text.toUpperCase()}! 🎊 You deserve all the happiness today! Let's throw some virtual confetti! ✨`;
      break;
    default:
      response = `Let's show some love to ${text}! ❤️`;
  }

  await m.reply(
    response,
    null,
    m.mentionedJid
      ? {
          mentions: m.mentionedJid,
        }
      : {}
  );
};

handler.command = handler.help = [
  "hug",
  "compliment",
  "cheer",
  "story",
  "celebrate",
];
handler.tags = ["fun"];
module.exports = handler;
