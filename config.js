let chalk = require("chalk");
let fs = require("fs");
const moment = require("moment-timezone");

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

global.owner = ["2349075341378", "2349132766510"]; // Owner numbers
global.mods = JSON.parse(fs.readFileSync("./src/mods.json"));
global.prems = JSON.parse(fs.readFileSync("./src/premium.json"));
global.link = JSON.parse(fs.readFileSync("./src/grouplink.json"));
global.group = link.map((v, i) => `Group ${i + 1}\n${v}`).join("\n\n");
global.numberowner = "2349075341378";
global.nameowner = "Akinade";
global.name = "A";
global.namebot = "Elaina-MD";
global.mail = "adebisiakinade.123@gmail.com";
global.instagram = "https://www.instagram.com/zuxxypml";
global.partner = "";
global.menu = "https://telegra.ph/file/cce9ab4551f7150f1970d.jpg";
global.eror = "_*Server Error*_";
global.wait = "_*Please wait, processing...*_";
global.wm = "*Elaina-MD*";
global.playlist = "37i9dQZF1DWTwnEm1IYyoj";

global.lann = "XwxIaeoY";
global.btc = "PjoZNP4j";

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

global.footer = "Simple WhatsApp Bot made by A";
global.set = {
  footer: "Simple WhatsApp Bot made by A",
};
global.packname = "A";
global.author = "⫹⫺ Elaina BOT";
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

global.dtu = "Instagram";
global.urlnya = "-";

global.dtc = "Call Owner";
global.phn = "+234 907-5341-378";

global.multiplier = 69; // The higher, the harder to level up

// FOR TIME
let ngHour = moment.tz("Africa/Lagos").format("HH");
let ngMinute = moment.tz("Africa/Lagos").format("mm");
let ngSecond = moment.tz("Africa/Lagos").format("ss");
let wktung = `${ngHour} H ${ngMinute} M ${ngSecond} S`;

let d = new Date();
let locale = "en-US";

let week = d.toLocaleDateString(locale, { weekday: "long" });
let date = d.toLocaleDateString(locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

let moodOfDay = {
  Monday: "Hustle Day",
  Tuesday: "Grind Day",
  Wednesday: "Midweek Push",
  Thursday: "Focus Day",
  Friday: "Jummah + Vibes",
  Saturday: "Rest and Flex ️️",
  Sunday: "Recharge Day",
};

let todayMood = moodOfDay[week] || "Blessed Day";

global.botdate = `⫹⫺ Day: ${week}, ${date} - Mood: ${todayMood}`;
global.bottime = `ᴛɪᴍᴇ: ${wktung}`;

global.ucap = greeting;

function greeting() {
  const hr = parseInt(moment.tz("Africa/Lagos").format("HH"));
  let greet;
  if (hr >= 2 && hr < 10) {
    greet = "Good Morning 🌤️";
  } else if (hr >= 10 && hr <= 14) {
    greet = "Good Afternoon ☀️";
  } else if (hr > 14 && hr <= 17) {
    greet = "Good Evening ⛅";
  } else {
    greet = "Good Night 🌙";
  }
  return greet;
}

const file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
});
