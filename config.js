const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment-timezone");

// Utility Functions
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

function greeting() {
  const hr = parseInt(moment.tz("Africa/Lagos").format("HH"));
  if (hr >= 2 && hr < 10) return "Good Morning 🌤️";
  if (hr >= 10 && hr <= 14) return "Good Afternoon ☀️";
  if (hr > 14 && hr <= 17) return "Good Evening ⛅";
  return "Good Night 🌙";
}

// Bot Owner Configuration
global.owner = ["2349075341378", "2349132766510"]; // Owner numbers
global.numberowner = "2349075341378";
global.nameowner = "Akinade";
global.mail = "adebisiakinade.123@gmail.com";
global.phn = "+234 907-5341-378";

// Bot Identity
global.name = "A";
global.namebot = "Elaina-MD";
global.packname = "A";
global.author = "⫹⫺ Elaina BOT";
global.wm = "*Elaina-MD*";
global.footer = "Simple WhatsApp Bot made by A";

// Social Media Links
global.instagram = "https://www.instagram.com/zuxxypml";
global.urlnya = "-";
global.menu = "https://telegra.ph/file/cce9ab4551f7150f1970d.jpg";
global.partner = "";

// API Configuration
global.APIs = {
  nrtm: "https://nurutomo.herokuapp.com",
  nrtm2: "http://localhost:5000",
  xteam: "https://api.xteam.xyz",
  vhtear: "https://api.vhtear.com",
  lann: "https://api.betabotz.eu.org",
  btc: "https://api.botcahx.eu.org",
  lolhuman: "http://api.lolhuman.xyz",
  alya: "https://api.alyachan.dev/",
};

global.APIKeys = {
  "https://api.zeks.xyz": "qyVJpszt0uSAL0lGCfOQIV3BVfp",
  "https://api.xteam.xyz": "Syahrulidhamz30",
  "http://api.lolhuman.xyz": "d5d9e369ab0bf0c231d43b17",
  "https://api.vhtear.com": "Syahrulidhamz30",
  "https://api.betabotz.eu.org": "XwxIaeoY",
  "https://api.botcahx.eu.org": "PjoZNP4j",
  "https://api.alyachan.dev/": "syah11",
};

// Bot Settings
global.playlist = "37i9dQZF1DWTwnEm1IYyoj";
global.multiplier = 69;
global.eror = "_*Server Error*_";
global.wait = "_*Please wait, processing...*_";
global.lann = "XwxIaeoY";
global.btc = "PjoZNP4j";
global.dtu = "Instagram";
global.dtc = "Call Owner";

// UI Elements
global.htjava = pickRandom(["乂", "❏", "⫹⫺", "⎔", "✦", "⭔", "⬟"]);
global.pmenus = pickRandom([
  "乂",
  "◈",
  "➭",
  "ଓ",
  "⟆•",
  "⳻",
  "•",
  "↬",
  "◈",
  "⭑",
  "ᯬ",
  "◉",
  "᭻",
  "»",
  "〆",
  "々",
  "✗",
  "♪",
]);

// Time and Date Configuration
const ngHour = moment.tz("Africa/Lagos").format("HH");
const ngMinute = moment.tz("Africa/Lagos").format("mm");
const ngSecond = moment.tz("Africa/Lagos").format("ss");
const wktung = `${ngHour} H ${ngMinute} M ${ngSecond} S`;

const d = new Date();
const locale = "en-US";
const week = d.toLocaleDateString(locale, { weekday: "long" });
const date = d.toLocaleDateString(locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const moodOfDay = {
  Monday: "Hustle Day",
  Tuesday: "Grind Day",
  Wednesday: "Midweek Push",
  Thursday: "Focus Day",
  Friday: "Jummah + Vibes",
  Saturday: "Rest and Flex ️️",
  Sunday: "Recharge Day",
};

global.botdate = `⫹⫺ Day: ${week}, ${date} - Mood: ${
  moodOfDay[week] || "Blessed Day"
}`;
global.bottime = `ᴛɪᴍᴇ: ${wktung}`;
global.ucap = greeting();

// Data Files
global.mods = JSON.parse(fs.readFileSync("./src/mods.json"));
global.prems = JSON.parse(fs.readFileSync("./src/premium.json"));
global.link = JSON.parse(fs.readFileSync("./src/grouplink.json"));
global.group = link.map((v, i) => `Group ${i + 1}\n${v}`).join("\n\n");

// File Watcher
const file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
});
