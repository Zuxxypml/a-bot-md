const fs = require("fs");
const { exec } = require("child_process");
const cp = require("child_process");
const { promisify } = require("util");
const exec_ = promisify(exec).bind(cp);

let handler = (m) => m;

handler.all = async function (m, { isOwner }) {
  if (m.isBaileys) return;
  if (m.chat.endsWith("broadcast")) return;

  let setting = global.db.data.settings[this.user.jid];
  let chats = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let { name, banned, registered } = user;

  let botInfo = `Main bot: @$${global.conn.user.jid.split`@`[0]}
Instagram Bot: https://instagram.com/zuxxypml`;

  if (/^bot$/i.test(m.text)) {
    if (m.isGroup && chats.isBanned) return;
    await this.reply(
      m.chat,
      `Hi, ${ucap()} ${user.registered ? name : m.name} 
${
  banned
    ? "_*You are banned from using the bot!*_\n_Contact the owner to lift the ban_"
    : `How can I help you?`
}
${botInfo}`,
      m
    );
    this.sendFile(m.chat, "./src/vn/hyu.mp3", "vn.mp3", null, m, true, {
      mimetype: "audio/mp4",
      ephemeralExpiration: 86400,
    });
  }

  if (/\bbot\b/i.test(m.text) && !chats.isBanned) {
    if (!setting.autoresp) return;
    this.respon = this.respon || {};
    if (!this.respon[m.chat]) this.respon[m.chat] = { bot: 0, date: 0 };
    if (this.respon[m.chat].date > Date.now()) return;

    this.respon[m.chat].bot += 1;
    if (this.respon[m.chat].bot > 4) {
      this.respon[m.chat].date = Date.now() + 6 * 60 * 60 * 1000; // 6 hours cooldown
      return;
    }

    m.reply(
      this.pickRandom([
        "Yes.. What is it?",
        "Hi, Bot here",
        "I am summoned",
        "Someone's calling~",
        "What's up?",
        "Why call? -_-",
        "Bot bot bot... nonstop",
        "Just use me directly, stop calling",
        "Piuuu... Boom...",
        "Tetetetete amazing energy",
      ])
    );
  }

  if (
    /audio/i.test(m.quoted?.mimetype) &&
    m.quoted.seconds === 1 &&
    m.quoted.isBaileys &&
    m.quoted.fromMe
  ) {
    m.reply(
      this.pickRandom([
        "Why tho 🙄",
        "My voice is great, huh :v",
        "I'm still a kid 😶",
      ])
    );
  }

  if (/(ass?alam)/i.test(m.text)) {
    m.reply(`_Wa'alaikumsalam Wr. Wb._`);
  }

  if (/^(h(a?i|alo))$/i.test(m.text) && !m.quoted) {
    m.reply(
      `Hi *${
        registered
          ? name
          : await conn.getName(m.sender, { withoutContact: true })
      }, _${ucap()}_*!`
    );
  }

  if (/^quiet/i.test(m.text)) {
    m.reply("Liven it up then");
  }

  if (
    setting.antitag &&
    m.mentionedJid?.includes(global.owner[2] + "@s.whatsapp.net") &&
    !chats.isBanned
  ) {
    m.reply("Why are you tagging my owner? -_");
  }

  const vnTriggers = {
    "^ara.ara$": "araara.opus",
    "^yamete": "yamete.opus",
    "^baka": "bakasong.mp3",
    chan: "onichan_1.oga",
    "^dame$": "dame.mp3",
    "^rawr$": "rawr.opus",
  };

  for (let [pattern, file] of Object.entries(vnTriggers)) {
    if (new RegExp(pattern, "i").test(m.text)) {
      this.sendFile(m.chat, `./src/vn/${file}`, file, null, m, true, {
        ephemeralExpiration: 86400,
      });
    }
  }

  if (!m.isGroup) {
    if (/[a-z]/i.test(m.text)) {
      if (m.fromMe) {
        chats.pc = Date.now();
        return;
      }
      if (Date.now() - chats.pc < 43200000) return;
      chats.pc = Date.now();
      chats.faham = true;
      const welcomeText = chats.faham
        ? [
            `Hi, ${ucap()} ${
              banned ? "You are banned. Contact the owner." : ""
            }`,
            "Please use the bot responsibly. No spamming or calls.",
            "Menu:",
            ".menu",
            "Group Link:",
            ".group",
            "Owner:",
            ".owner",
          ]
        : [
            "Welcome! 😁 I'm your WhatsApp bot.",
            "How much do you know about bots?",
            "I understand now",
            ".sayasudahfaham",
            "What is a bot?",
            ".help",
          ];

      conn.reply(m.chat, welcomeText[0] + "\n\n" + welcomeText[1], m);
    }

    if (
      (m.mtype === "groupInviteMessage" ||
        m.text.includes("https://chat") ||
        m.text.startsWith("Open this link")) &&
      !m.isBaileys &&
      !isOwner
    ) {
      this.reply(
        m.chat,
        `Invite Bot:
Price: NGN. 10,000/month
Via Qris, Dana, GO-Pay
Pulse: NGN. 15,000
Contact Owner for info.`,
        m
      );
    }
  }

  if (setting.autoreact && m.text.length > 25) {
    this.sendMessage(m.chat, {
      react: {
        text: this.pickRandom([
          "🌷",
          "🏵️",
          "🌠",
          "🐱",
          "🦄",
          "🐬",
          "🐥",
          "🐠",
          "⛲",
          "🏝️",
        ]),
        key: m.key,
      },
    });
  }

  if (setting.backup && Date.now() - setting.backupDB > 3600000) {
    setting.backupDB = Date.now();
    conn.reply(global.owner[0] + "@s.whatsapp.net", `Database Backup`, null);
    conn.sendFile(
      global.owner[0] + "@s.whatsapp.net",
      fs.readFileSync("./database.json"),
      "database.json",
      "",
      false,
      false,
      { mimetype: "application/json" }
    );
  }

  if (setting.backupsc && Date.now() - setting.backupSc > 3600000) {
    setting.backupSc = Date.now();
    const zipFileName = `BackupScript.zip`;
    const file = fs.readFileSync("./BackupScript.zip");
    conn.sendMessage(
      global.owner[0] + "@s.whatsapp.net",
      {
        document: file,
        mimetype: "application/zip",
        fileName: zipFileName,
        caption: "Backup complete. Download below.",
      },
      { quoted: m }
    );

    setTimeout(() => {
      fs.unlinkSync(zipFileName);
      conn.reply(global.owner[0] + "@s.whatsapp.net", `Backup file deleted.`);
    }, 3000);

    setTimeout(() => {
      let zipCommand = `zip -r ${zipFileName} * -x \"node_modules/*\"`;
      exec_(zipCommand);
    }, 1000);
  }
};

module.exports = handler;
