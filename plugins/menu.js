const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const levelling = require("../lib/levelling");

let handler = async (m, { conn, usedPrefix: _p, args }) => {
  // Menu Configuration
  const menuConfig = {
    before: `
╔════════════════
╟ Hi, %name!
╚════════════════

┏❏──「 BOT INFO 」───⬣
│○ Library: Baileys
│○ Role: WhatsApp Assistant
┗––––––––––✦

┌ ◦ Uptime: %uptime
│ ◦ Date: %week, %date
│ ◦ Server Time: %time
│ ◦ Version: %version
│ ◦ Prefix: [ %p ]
└ ◦ Registered Users: %rtotalreg/%totalreg

┏❏──「 NOTES 」───⬣
│○ Report bugs to owner
│○ Ⓟ = Premium Feature
│○ Ⓛ = Limited Feature
┗––––––––––✦
`.trim(),
    header: "*〘 %category 〙*\n╔══════════════",
    body: "╟ %cmd%islimit",
    footer: "╚════════════════\n",
    after: `Powered by ${global.nameowner}`,
  };

  try {
    // User Data
    let {
      exp,
      limit,
      level,
      registered,
      role,
      name: username,
    } = global.db.data.users[m.sender];
    let { min, xp, max } = levelling.xpRange(level, global.multiplier);

    // Time Data
    let d = new Date();
    let locale = "en";
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

    // System Stats
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(
      (user) => user.registered
    ).length;

    // Menu Categories
    let type = (args[0] || "").toLowerCase();
    let tags = {};
    let description = "";

    switch (type) {
      case "sticker":
        tags = {
          sticker: "Sticker Maker",
          stickertext: "Text to Sticker",
          stickertomedia: "Sticker to Media",
          stickerother: "Other Stickers",
          stickerprems: "Premium Stickers",
        };
        description = "Create stickers from text, images, or videos";
        break;

      case "download":
        tags = {
          downloader: "Downloader",
          downloadersosmed: "Social Media",
          downloaderanime: "Anime Content",
        };
        description = `Download media from various platforms\nExample:\n${_p}tiktok https://vm.tiktok.com/abcdef`;
        break;

      // Add other cases similarly...

      default:
        tags = { menuringkas: "Quick Menu" };
        break;
    }

    // Generate Menu Text
    let text = type
      ? menuConfig.before + "\n" + description + "\n"
      : menuConfig.before;

    // Get all plugins and organize by tags
    let plugins = Object.values(global.plugins)
      .filter((plugin) => plugin.tags)
      .map((plugin) => ({
        help: plugin.help,
        tags: plugin.tags,
        prefix: plugin.customPrefix,
        limit: plugin.limit,
      }));

    // Group plugins by category
    let categories = {};
    for (let tag in tags) {
      categories[tag] = plugins.filter(
        (plugin) => plugin.tags && plugin.tags.includes(tag)
      );
    }

    // Build menu sections
    for (let tag in categories) {
      text += menuConfig.header.replace("%category", tags[tag]) + "\n";

      categories[tag].forEach((plugin) => {
        plugin.help.forEach((help) => {
          let cmd = plugin.prefix ? help : _p + help;
          text +=
            menuConfig.body
              .replace("%cmd", cmd)
              .replace("%islimit", plugin.limit ? " Ⓛ" : "") + "\n";
        });
      });

      text += menuConfig.footer;
    }

    text += menuConfig.after;

    // Replace placeholders
    let replacements = {
      "%": "%",
      p: _p,
      uptime,
      name: username,
      week,
      date,
      time,
      totalreg,
      rtotalreg,
      version: "5.0.0",
      exp: exp - min,
      maxexp: xp,
      xp4levelup: max - exp,
      level,
      limit,
      role,
    };

    text = text.replace(
      new RegExp(
        `%(${Object.keys(replacements).sort((a, b) => b.length - a.length)
          .join`|`})`,
        "g"
      ),
      (_, name) => replacements[name] || ""
    );

    // Send menu
    await conn.sendMessage(m.chat, {
      text: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: date,
          body: "Bot Menu",
          thumbnail: await (
            await fetch("https://i.imgur.com/8Km9tLL.png")
          ).buffer(),
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, "An error occurred while generating the menu", m);
  }
};

// Helper function
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}

handler.help = [
  "menu",
  "menu sticker",
  "menu download",
  // Add other menu types...
].map((v) => v + " [category]");

handler.tags = ["main"];
handler.command = /^(menu|help|\?)$/i;
handler.exp = 3;

module.exports = handler;
