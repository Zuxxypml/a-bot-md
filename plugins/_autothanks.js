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
  let isThanks = false;
  thanksWords.forEach((thanksWord) => {
    if (m.text.toLowerCase().includes(thanksWord)) {
      isThanks = true;
    }
  });
  if (isThanks) {
    let replyMessage = "You're welcome! 🙏🏾 Stay blessed!";
    m.reply(replyMessage);
  }
};

handler.customPrefix =
  /^((thanks?|thank you|tanks?|tanx|gracias|much appreciated|nice one|bless up|bless you|gbayi|ese|dalu|eku ise)(\s|$))/i;
handler.command = new RegExp();
module.exports = handler;
