let handler = (m) => m;
let fs = require("fs");
let json = JSON.parse(fs.readFileSync("./src/premium.json"));

handler.before = async function (m) {
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];

  if (chat.gcdate !== 0 && !chat.permanent) {
    if (chat.gcdate <= new Date() * 1) {
      chat.gcdate = 0;
      chat.init = false;
      chat.lastUse = new Date() * 1;
      chat.trialnotif = false;
      await this.reply(
        m.chat,
        `The bot's active period has expired.\nThe bot will no longer respond.\n\nPlease reactivate it after 2 days.`,
        0
      );
      await this.sendContact(m.chat, global.owner[2], "Bot Owner", false);
    }
  }

  if (new Date() - chat.lastUse > 86400000) {
    if (!chat.trialnotif)
      this.reply(
        m.chat,
        `The bot can now be activated again, please enter a redeem code.`
      );
    chat.trial = 0;
    chat.lastUse = -1;
    chat.trialnotif = true;
    return;
  }

  if (
    json.map((v) => v.replace(/[^0-9]/g, "")).includes(m.sender.split`@`[0]) &&
    user.premdate &&
    user.premdate != 0
  ) {
    if (user.premdate < new Date() * 1) {
      delete require.cache[require.resolve("../config")];
      require("../config");
      let index = json.indexOf(m.sender.split`@`[0]);
      await json.splice(index, 1);
      fs.writeFileSync("./src/premium.json", JSON.stringify(json));
      delete require.cache[require.resolve("../config")];
      require("../config");
      this.reply(
        m.sender,
        `_Dear ${await conn.getName(
          m.sender
        )}, your premium access has expired._\nPlease contact the owner to renew.`,
        m
      );
      db.data.users[m.sender].premdate = 0;
    }
  }
};

module.exports = handler;
