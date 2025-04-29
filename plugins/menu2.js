//━━━━━━━━[ DEFAULT SETTINGS ]━━━━━━━━//
let {
  default: makeWASocket,
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  downloadHistory,
  proto,
  getMessage,
  generateWAMessageContent,
  prepareWAMessageMedia,
} = require("@adiwajshing/baileys");
let levelling = require("../lib/levelling");
let fs = require("fs");
const util = require("util");
const os = require("os");
let path = require("path");
let { createHash } = require("crypto");
let fetch = require("node-fetch");
let { performance } = require("perf_hooks");
let moment = require("moment-timezone");

//━━━━━━━━[ CATEGORY ]━━━━━━━━//
let handler = async (
  m,
  { conn, usedPrefix: _p, args, usedPrefix, command }
) => {
  try {
    let tags;
    let teks = `${args[0]}`.toLowerCase();
    let arrayMenu = [
      "all",
      "main",
      "downloader",
      "sticker",
      "xp",
      "game",
      "rpg",
      "asupan",
      "group",
      "fun",
      "tools",
      "internet",
      "info",
      "islam",
      "kerang",
      "maker",
      "stalk",
      "quotes",
      "shortlink",
      "anonymous",
      "voicechanger",
      "image",
      "nsfw",
      "owner",
      "advanced",
    ];
    if (!arrayMenu.includes(teks)) teks = "404";
    if (teks == "all")
      tags = {
        main: "MAIN MENU",
        downloader: "DOWNLOADER MENU",
        sticker: "CONVERT MENU",
        xp: "EXP MENU",
        game: "GAME MENU",
        rpg: "RPG MENU",
        group: "GROUP MENU",
        fun: "FUN MENU",
        tools: "TOOLS MENU",
        internet: "INTERNET",
        info: "INFO MENU",
        islam: "ISLAMIC MENU",
        kerang: "KERANG MENU",
        asupan: "ASUPAN MENU",
        maker: "MAKER MENU",
        quotes: "QUOTES MENU",
        stalk: "STALK MENU",
        shortlink: "SHORT LINK",
        anonymous: "ANONYMOUS CHAT",
        voicechanger: "VOICE CHANGER",
        image: "IMAGE MENU",
        nsfw: "NSFW MENU",
        owner: "OWNER MENU",
        advanced: "ADVANCED",
      };
    if (teks == "main")
      tags = {
        main: "MAIN MENU",
      };
    if (teks == "downloader")
      tags = {
        downloader: "DOWNLOADER MENU",
      };
    if (teks == "sticker")
      tags = {
        sticker: "CONVERT MENU",
      };
    if (teks == "xp")
      tags = {
        xp: "EXP MENU",
      };
    if (teks == "asupan")
      tags = {
        asupan: "ASUPAN MENU",
      };
    if (teks == "game")
      tags = {
        game: "GAME MENU",
      };
    if (teks == "rpg")
      tags = {
        rpg: "RPG MENU",
      };
    if (teks == "group")
      tags = {
        group: "GROUP MENU",
      };
    if (teks == "fun")
      tags = {
        fun: "FUN MENU",
      };
    if (teks == "tools")
      tags = {
        tools: "TOOLS MENU",
      };
    if (teks == "internet")
      tags = {
        internet: "INTERNET",
      };
    if (teks == "info")
      tags = {
        info: "INFO MENU",
      };
    if (teks == "islam")
      tags = {
        islam: "ISLAMIC MENU",
      };
    if (teks == "kerang")
      tags = {
        kerang: "KERANG MENU",
      };
    if (teks == "maker")
      tags = {
        maker: "MAKER MENU",
      };
    if (teks == "quotes")
      tags = {
        quotes: "QUOTES MENU",
      };
    if (teks == "stalk")
      tags = {
        stalk: "STALK MENU",
      };
    if (teks == "shortlink")
      tags = {
        shortlink: "SHORT LINK",
      };
    if (teks == "anonymous")
      tags = {
        anonymous: "ANONYMOUS CHAT",
      };
    if (teks == "voicechanger")
      tags = {
        voicechanger: "VOICE CHANGER",
      };
    if (teks == "image")
      tags = {
        image: "IMAGE MENU",
      };
    if (teks == "nsfw")
      tags = {
        nsfw: "NSFW MENU",
      };
    if (teks == "owner")
      tags = {
        owner: "OWNER MENU",
      };
    if (teks == "advanced")
      tags = {
        advanced: "ADVANCED MENU",
      };

    //━━━━━━━━[ DEFAULT MENU ]━━━━━━━━//
    const defaultMenu = {
      before: ``.trimStart(),
      header: "『  *%category*  』",
      body: "▸ %cmd %islimit %isPremium",
      footer: "________\n",
      after: `Made With ${global.nameowner}`,
    };

    //━━━━━━━━[ DATABASE USER ]━━━━━━━━//
    let package = JSON.parse(
      await fs.promises
        .readFile(path.join(__dirname, "../package.json"))
        .catch((_) => "{}")
    );
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    else who = m.sender;
    let name = conn.getName(m.sender);
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(
      (user) => user.registered == true
    ).length;
    let premium = global.db.data.users[m.sender].premium;
    let user = global.db.data.users[who];
    let { exp, limit, level, money, role } = global.db.data.users[m.sender];
    let { min, xp, max } = levelling.xpRange(level, global.multiplier);
    let tag = `@${m.sender.split("@")[0]}`;
    m, { contextInfo: { mentionedJid: conn.parseMention(tag) } };

    //━━━━━━━━[ TIMER ]━━━━━━━━//
    let d = new Date(new Date() + 3600000);
    let locale = "en";
    let wib = moment.tz("Asia/Jakarta").format("HH:mm:ss");
    let week = d.toLocaleDateString(locale, { weekday: "long" });
    let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
      Math.floor(d / 84600000) % 5
    ];
    let date = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let dateIslamic = Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
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
    let muptime = clockString(_muptime);
    let uptime = clockString(_uptime);
    let waktuwib = moment.tz("Asia/Jakarta").format("HH:mm:ss");

    //━━━━━━━━[ SETTING HELP ]━━━━━━━━//
    let help = Object.values(global.plugins)
      .filter((plugin) => !plugin.disabled)
      .map((plugin) => {
        return {
          help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
          tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
          prefix: "customPrefix" in plugin,
          limit: plugin.limit,
          premium: plugin.premium,
          enabled: !plugin.disabled,
        };
      });

    //━━━━━━━━[ MENU SECTION ]━━━━━━━━//
    let skntex = `Hello ${tag} %greeting
[ 𝐃 𝐀 𝐒 𝐇 𝐁 𝐎 𝐀 𝐑 𝐃 ]
• 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: *R E M B O T Z*
• 𝐓𝐢𝐦𝐞: *${time}*
• 𝐃𝐚𝐭𝐞: *${week} ${weton}*
• 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐃𝐚𝐭𝐞: *${dateIslamic}*
• 𝐔𝐩𝐭𝐢𝐦𝐞: *${uptime}*
• 𝐔𝐬𝐞𝐫 𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞: *${rtotalreg} of ${totalreg}*`;
    if (teks == "404") {
      let sections = [
        {
          title: "Menu List",
          rows: [
            {
              header: "",
              title: "All Menu",
              highlight_label: "Recommended",
              description: "Display all menu features",
              id: `.menuall`,
            },
            {
              header: "",
              title: "Main Menu",
              description: "Display Main Menu",
              id: `${_p + command} main`,
            },
            {
              header: "",
              title: "Downloader Menu",
              description: "All download features",
              id: `.menu downloader`,
            },
            {
              header: "",
              title: "Sticker Menu",
              description: "Sticker-related features",
              id: `${_p + command} sticker`,
            },
            {
              header: "",
              title: "EXP Menu",
              description: "Claim EXP",
              id: `${_p + command} xp`,
            },
            {
              header: "",
              title: "Game Menu",
              description: "All game features",
              id: `${_p + command} game`,
            },
            {
              header: "",
              title: "RPG Menu",
              description: "All RPG game features",
              id: `${_p + command} rpg`,
            },
            {
              header: "",
              title: "Group Menu",
              description: "All group features",
              id: `${_p + command} group`,
            },
            {
              header: "",
              title: "Fun Menu",
              description: "Fun features",
              id: `${_p + command} fun`,
            },
            {
              header: "",
              title: "Tools Menu",
              description: "Tool-related features",
              id: `${_p + command} tools`,
            },
            {
              header: "",
              title: "Internet Menu",
              description: "Internet-related features",
              id: `${_p + command} internet`,
            },
            {
              header: "",
              title: "Info/AI Menu",
              description: "Info and AI features",
              id: `${_p + command} info`,
            },
            {
              header: "",
              title: "Islamic Menu",
              description: "Islamic features 🌜",
              id: `${_p + command} islam`,
            },
            {
              header: "",
              title: "Kerang Menu",
              description: "Kerang features",
              id: `${_p + command} kerang`,
            },
            {
              header: "",
              title: "Maker Menu",
              description: "Textpro maker features",
              id: `${_p + command} maker`,
            },
            {
              header: "",
              title: "Anime Menu",
              description: "Display anime menu",
              id: `${_p + command} image`,
            },
            {
              header: "",
              title: "Owner Menu",
              description: "Exclusive for bot owner",
              id: `${_p + command} owner`,
            },
            {
              header: "",
              title: "Quotes Menu",
              description: "Collection of quotes",
              id: `${_p + command} quotes`,
            },
            {
              header: "",
              title: "Stalking Menu",
              description: "Stalking features",
              id: `${_p + command} stalk`,
            },
            {
              header: "",
              title: "NSFW Menu 🅟",
              description: "PREMIUM ONLY",
              id: `${_p + command} nsfw`,
            },
          ],
        },
        {
          title: "BOT INFO",
          rows: [
            {
              header: "",
              title: "Creator",
              description: "Bot developer's contact",
              id: `${_p}owner`,
            },
            {
              header: "",
              title: "Speed",
              description: "Display bot response speed",
              id: `${_p}ping`,
            },
          ],
        },
      ];
      const fcon = {
        key: {
          participant: `0@s.whatsapp.net`,
          ...(m.chat ? { remoteJid: `status@broadcast` } : {}),
        },
        message: { contactMessage: { displayName: `${name}` } },
      };
      let media = await prepareWAMessageMedia(
        {
          image: {
            url: "https://btch.pages.dev/file/115260d4449d8d98f212e.jpg",
          },
        },
        { upload: conn.waUploadToServer }
      );
      let msg = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              body: {
                text: skntex,
              },
              footer: {
                text: wm,
              },
              header: proto.Message.InteractiveMessage.Header.create({
                ...media,
                title: "",
                subtitle: "",
                hasMediaAttachment: false,
              }),
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "Menu List ⎙",
                      sections: sections,
                    }),
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "Bot Update Channel",
                      url: "https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O",
                      merchant_url:
                        "https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O",
                    }),
                  },
                ],
              },
              contextInfo: {
                quotedMessage: m.message,
                participant: m.sender,
                ...m.key,
              },
            },
          },
        },
      };
      return conn.relayMessage(m.chat, msg, fcon, {});
    }

    let groups = {};
    for (let tag in tags) {
      groups[tag] = [];
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin);
    }
    conn.menu = conn.menu ? conn.menu : {};
    let before = conn.menu.before || defaultMenu.before;
    let header = conn.menu.header || defaultMenu.header;
    let body = conn.menu.body || defaultMenu.body;
    let footer = conn.menu.footer || defaultMenu.footer;
    let after =
      conn.menu.after ||
      (conn.user.jid == global.conn.user.jid
        ? ""
        : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) +
        defaultMenu.after;
    let _text = [
      before,
      ...Object.keys(tags).map((tag) => {
        return (
          header.replace(/%category/g, tags[tag]) +
          "\n" +
          [
            ...help
              .filter(
                (menu) => menu.tags && menu.tags.includes(tag) && menu.help
              )
              .map((menu) => {
                return menu.help
                  .map((help) => {
                    return body
                      .replace(/%cmd/g, menu)
                      .replace(/%islimit/g, menu.limit ? "(Ⓛ)" : "")
                      .replace(/%isPremium/g, menu.premium ? "(Ⓟ)" : "")
                      .trim();
                  })
                  .join("\n");
              }),
            footer,
          ].join("\n")
        );
      }),
      after,
    ].join("\n");
    text =
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
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage
        ? package.homepage.url || package.homepage
        : "[unknown github url]",
      name,
      greeting: greeting(),
      level,
      limit,
      money,
      name,
      weton,
      week,
      date,
      dateIslamic,
      time,
      totalreg,
      rtotalreg,
      role,
      readmore: readMore,
    };

    //━━━━━━━━[ SETTINGS MENU ]━━━━━━━━//
    text = text.replace(
      new RegExp(
        `%(${Object.keys(replace).sort((a, b) => b.length - a.length)
          .join`|`})`,
        "g"
      ),
      (_, name) => "" + replace[name]
    );

    let vn = "https://file.betabotz.eu.org/file/wv9pkwd9mcb0ytx1k8if.aac";

    await conn.sendMessage(
      m.chat,
      {
        video: { url: "https://btch.pages.dev/file/8af3d30240c29c2ddc024.mp4" },
        gifPlayback: true,
        caption: text,
        contextInfo: {
          externalAdReply: {
            title: namebot,
            body: nameowner,
            thumbnailUrl:
              "https://btch.pages.dev/file/7081ad0d533f9f9d3db9c.jpg",
            sourceUrl: ``,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      {
        quoted: m,
      }
    );
    conn.sendFile(m.chat, vn, null, null, m, true, { ptt: true });
  } catch (e) {
    conn.reply(m.chat, "Sorry, the menu is experiencing an error", m);
    throw e;
  }
};
handler.help = ["menu2", "help2", "?"];
handler.tags = ["main"];
handler.command = /^(menu2|help2|\?)$/i;
handler.owner = false;
handler.register = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.exp = 3;

module.exports = handler;

//━━━━━━━━[ DO NOT MODIFY ]━━━━━━━━//
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

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
