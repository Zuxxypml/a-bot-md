const fetch = require("node-fetch");
const fs = require("fs");

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let template = (args[0] || "").toLowerCase();
  if (!args[0]) {
    let caption = `*Example Usage*

${usedPrefix + command} stupid @user

*Available Options*
• dog
• pig
• bastard
• sissy
• trash
• dumb
• scum
• idiot
• fool
• deaf
• blind
• crazy
• insane
• evil
• ugly
• goblin
• monkey
• demon
• cursed
• loser
• stupid
• useless
• annoying
• bitch
• whore
• dumbass
• trashy
• dirty
• psycho
• maniac
• stupidass
• poop
• retarded
• village idiot
• peasant
• cursed soul
`;

    await conn.reply(m.chat, caption, m, {
      mentions: conn.parseMention(caption),
    });
    return;
  }

  if (command) {
    switch (template) {
      case "dog":
      case "pig":
      case "bastard":
      case "sissy":
      case "trash":
      case "dumb":
      case "scum":
      case "idiot":
      case "fool":
      case "deaf":
      case "blind":
      case "crazy":
      case "insane":
      case "evil":
      case "ugly":
      case "goblin":
      case "monkey":
      case "demon":
      case "cursed":
      case "loser":
      case "useless":
      case "annoying":
      case "bitch":
      case "whore":
      case "dumbass":
      case "trashy":
      case "dirty":
      case "psycho":
      case "maniac":
      case "stupidass":
      case "poop":
      case "retarded":
      case "village idiot":
      case "peasant":
      case "cursed soul":
        let who =
          m.mentionedJid && m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.fromMe
            ? conn.user.jid
            : m.sender;
        let pp = await conn
          .profilePictureUrl(who)
          .catch((_) => "https://telegra.ph/file/placeholder.jpg");
        let name = await conn.getName(who);
        const cek2 = cek1[Math.floor(Math.random() * cek1.length)];

        let caption = `The *${template}* level\nof ${
          name ? name : "*Everyone*"
        } (@${who.split("@")[0]}) is ${cek2}% 😆`;

        await conn.reply(m.chat, caption, m, {
          mentions: conn.parseMention(caption),
        });
        break;
    }
  }
};

handler.help = ["check <menu> <user>"];
handler.tags = ["fun"];
handler.command = /^cek$/i;
module.exports = handler;

global.cek1 = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
