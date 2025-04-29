let fs = require("fs");
let path = require("path");
let fetch = require("node-fetch");
let moment = require("moment-timezone");
let levelling = require("../lib/levelling");
let desc = "";

let handler = async (m, { conn, usedPrefix: _p, args }) => {
  let fakeOption = {
    key: {
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net",
      fromMe: false,
    },
    message: {
      imageMessage: {
        caption: `Elaina-bot WhatsApp`,
        thumbnail: global.menu,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };
  let defaultMenu = {
    before: `
╔══════════════
╟「 Hello, %greeting *${conn.user.name}* 」
╚════════════════
`.trim(),
    header: "*〘 %category 〙*\n╔══════════════",
    body: "╟ %cmd%islimit",
    footer: "╚════════════════\n",
    after: `*%week %weton, %date*\n*Server Time:* %time WAT`,
  };
  try {
    let tags;
    let type = (args[0] || "").toLowerCase();
    switch (type) {
      case "sticker":
      case "stiker":
        tags = {
          sticker: "Sticker Menu",
          stickertext: "Text to Sticker",
          stickertomedia: "Sticker to Media",
          stickerother: "Other Stickers",
          stickerprems: "Premium Stickers",
        };
        desc =
          "This is a feature to create your own stickers from images/videos/text";
        break;
      case "all":
        tags = {
          main: "Main",
          anonymous: "Anonymous",
          islami: "Islamic",
          game: "Game",
          anime: "Anime",
          tools: "Tools",
          fun: "Fun",
          primbon: "Primbon",
          group: "Group",
          info: "Info",
          audio: "Audio",
          maker: "Maker",
          internet: "Internet",
          downloader: "Downloader",
          nsfw: "NSFW",
          vote: "Voting",
          absen: "Attendance",
          premium: "Premium",
          advanced: "Advanced",
          owner: "Owner",
          giveaway: "Giveaway",
          nocategory: "No Category",
        };
        desc = `This includes all available bot features`;
        break;
      case "download":
        tags = {
          downloader: "Download Menu",
          downloadersosmed: "Social Media Download",
          downloaderanime: "Anime Download",
        };
        desc = `This is a feature to download media using a link/URL
Example:
${_p}tiktok https://vm.tiktok.com/abcdefghi
`;
        break;
      case "edukasi":
        tags = {
          belajar: "Education Menu",
        };
        desc = `This is an education feature`;
        break;
      case "media":
        tags = {
          media: "Media Menu",
        };
        desc = `
This is a feature to download media using keywords
Example:
${_p}play bertaut
`;
      case "anime":
        tags = {
          anime: "Anime Menu",
        };
        desc = `
This is a feature to download anime using titles
Example:
${_p}anichin yosuga no sora
`;
        break;
      case "gambar":
        tags = {
          image: "Image Menu",
          imagerandom: "Random",
          photooxy: "Photooxy Menu",
          textpro: "TextPro Menu",
        };
        desc = `This is an image generator feature`;
        break;
      case "maker":
        tags = {
          maker: "Maker Menu",
        };
        desc = `This is a creation/maker feature`;
        break;
      case "pencarian":
        tags = {
          search: "Search Menu",
        };
        desc = `This is a search feature based on keywords`;
        break;
      case "tools":
      case "tool":
        tags = {
          tools: "Tools Menu",
        };
        desc = `This is a tools/utility feature`;
        break;
      case "sastra":
        tags = {
          quotes: "Literature Menu",
        };
        desc = `This is a selection of literary features`;
        break;
      case "group":
        tags = {
          group: "Group Menu",
          admin: "Group Admin",
        };
        desc = `This is a feature for Group Chats`;
        break;
      case "fun":
        tags = {
          fun: "Fun Menu",
          kerang: "Magic Shell",
        };
        desc = `This is a fun/entertainment feature`;
        break;
      case "game":
        tags = {
          game: "Game Menu",
        };
        desc = `These are some game features`;
        break;
      case "ai":
        tags = {
          ai: "AI Menu",
        };
        desc = `This is the AI menu`;
        break;
      case "rpg":
        tags = {
          rpg: "RPG Menu",
        };
        desc = `These are some RPG features`;
        break;
      case "premium":
        tags = {
          premium: "Premium Menu",
          jadibot: "Become Bot",
        };
        desc = `This is a feature exclusive to Premium users`;
        break;
      case "info":
        tags = {
          main: "Start Bot",
          xp: "Exp & Limit",
          info: "Info Menu",
        };
        desc = `This is a Bot Information feature`;
        break;
      case "anony":
        tags = {
          anonymous: "Anonymous Chat",
        };
        desc = `This is an Anonymous Chat feature that allows you to chat with strangers, similar to Telegram
Note: This feature is only available in Private Chat
`;
        break;
      case "owner":
        tags = {
          owner: "Owner/Jadibot Menu",
        };
        desc = `This is a feature exclusive to Owner/Jadibot`;
        break;
      case "editor":
        tags = {
          audio: "Audio Editor Menu",
          editorgambar: "Coming soon",
        };
        break;
      case "msg":
      case "penyimpanan":
      case "database":
        tags = {
          database: "Storage Menu",
          cmd: "Command Media Menu",
        };
        desc = `For storing text, voice notes, audio, video, images in the bot's memory`;
        break;
      case "kelas":
        tags = {
          vote: "Vote Menu",
          absen: "Attendance Menu",
        };
        break;
      default:
        type = "";
        break;
    }
    let {
      exp,
      limit,
      level,
      registered,
      role,
      name: namaa,
    } = global.db.data.users[m.sender];
    let { min, xp, max } = levelling.xpRange(level, global.multiplier);
    let name = namaa;
    let d = new Date();
    let locale = "en";
    let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
      Math.floor((d * 1 + d.getTimezoneOffset()) / 84600000) % 5
    ];
    let week = d.toLocaleDateString(locale, { weekday: "long" });
    let date = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let time = d.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    let _uptime = process.uptime() * 1000;
    let _muptime;
    if (process.send) {
      process.send("uptime");
      _muptime =
        (await new Promise((resolve) => {
          process.once("message", resolve);
          setTimeout(resolve, 1000);
        })) * 1000;
    }
    conn.menu = conn.menu ? conn.menu : {};
    let muptime = clockString(_muptime);
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(
      (user) => user.registered == true
    ).length;
    let before = conn.menu.before || defaultMenu.before;
    let header = conn.menu.header || defaultMenu.header;
    let body = conn.menu.body || defaultMenu.body;
    let footer = conn.menu.footer || defaultMenu.footer;
    let after = conn.menu.after || defaultMenu.after;
    let _text;
    if (!type) {
      tags = {
        menuringkas: "Menu List",
      };
      before =
        conn.menu.before ||
        `
Hello, 
_%greeting *%name!*_

┏❏──「 *INFO* 」───⬣
│○ *Library:* Baileys
│○ *Function:* Assistant
┗––––––––––✦
 
┌  ◦ Uptime: %uptime
│  ◦ Day: %week %weton
│  ◦ Time: %time
│  ◦ Date: %date
│  ◦ Version: %version
└  ◦ Prefix Used: [ %p ]

┏❏──「 *NOTE* 」───⬣
│○ If you find a bug or want
│ a premium upgrade, please
│ contact the owner.
│○ *Ⓟ* = Premium
│○ *Ⓛ* = Limit
┗––––––––––✦
`;
      _text = before;
    } else {
      _text = before + "\n" + desc + "\n";
    }

    for (let plugin of Object.values(global.plugins))
      if (plugin && "tags" in plugin)
        for (let tag of plugin.tags) if (!tag in tags) tags[tag] = tag;
    let help = Object.values(global.plugins).map((plugin) => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: "customPrefix" in plugin,
        limit: plugin.limit,
      };
    });
    let groups = {};
    for (let tag in tags) {
      groups[tag] = [];
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu);
    }

    for (let tag in groups) {
      _text += header.replace(/%category/g, tags[tag]) + "\n";
      for (let menu of groups[tag]) {
        for (let help of menu.help)
          _text +=
            body
              .replace(/%cmd/g, menu.prefix ? help : "%p" + help)
              .replace(/%islimit/g, menu.limit ? " " : "") + "\n";
      }
      _text += footer;
    }
    _text += after;
    let text =
      typeof conn.menu == "string"
        ? conn.menu
        : typeof conn.menu == "object"
        ? _text
        : "";
    let replace = {
      "%": "%",
      p: _p,
      uptime,
      muptime,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      version: `5.0.0`,
      xp4levelup: max - exp,
      level,
      limit,
      name,
      greeting: greeting(),
      weton,
      week,
      date,
      time,
      totalreg,
      rtotalreg,
      role,
      readmore: conn.readmore,
    };
    text = text.replace(
      new RegExp(
        `%(${Object.keys(replace).sort((a, b) => b.length - a.length)
          .join`|`})`,
        "g"
      ),
      (_, name) => "" + replace[name]
    );
    conn.relayMessage(
      m.chat,
      {
        extendedTextMessage: {
          text: text,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              title: date,
              mediaType: 1,
              previewType: 0,
              renderLargerThumbnail: true,
              thumbnailUrl: "https://telegra.ph/file/cce9ab4551f7150f1970d.jpg",
              sourceUrl:
                "https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F",
            },
          },
          mentions: [m.sender],
        },
      },
      {}
    );
  } catch (e) {
    throw e;
  }
};
handler.help = [
  "all",
  "stiker",
  "anony",
  "download",
  "media",
  "edukasi",
  "ai",
  "gambar",
  "maker",
  "pencarian",
  "tools",
  "sastra",
  "group",
  "kelas",
  "fun",
  "game",
  "rpg",
  "premium",
  "penyimpanan",
  "editor",
  "owner",
  "info",
].map((v) => "menu " + v);
handler.tags = ["menuringkas"];
handler.command = /^(menu)$/i;
handler.exp = 3;
module.exports = handler;

function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}

function greeting() {
  const time = moment.tz("Africa/Lagos").format("HH");
  let res = "Good Early Morning";
  if (time >= 4) {
    res = "Good Morning";
  }
  if (time > 10) {
    res = "Good Afternoon";
  }
  if (time >= 15) {
    res = "Good Evening";
  }
  if (time >= 18) {
    res = "Good Night";
  }
  return res;
}
