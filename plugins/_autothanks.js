let handler = async (m, { conn }) => {
  let thanksWords = [
    "thanks",
    "thank you",
    "tanks",
    "tanx",
    "gracias",
    "much appreciated",
    "nice one",
    "bless up",
    "bless you",
    "gbayi",
    "ese",
    "dalu",
    "eku ise",
  ];

  // Lowercase and check if message includes any thank word
  let isThanks = thanksWords.some((word) =>
    m.text?.toLowerCase().includes(word)
  );

  // Ensure it's not the bot replying to itself
  if (isThanks && m.sender !== conn.user.jid) {
    m.reply("You're welcome! 🙏🏾 Stay blessed!");
  }
};

handler.customPrefix =
  /^((thanks?|thank you|tanks?|tanx|gracias|much appreciated|nice one|bless up|bless you|gbayi|ese|dalu|eku ise)(\s|$))/i;
handler.command = new RegExp(); // empty pattern to use customPrefix
module.exports = handler;
