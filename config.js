let chalk = require('chalk')
let fs = require('fs')
function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}
global.owner = ['2349075341378','2349132766510'] // Put your number here
global.mods = JSON.parse(fs.readFileSync('./src/mods.json')) // Want some help?
global.prems = JSON.parse(fs.readFileSync('./src/premium.json')) // Pengguna premium tidak memerlukan limit // Premium user has unlimited limit
global.link = JSON.parse(fs.readFileSync('./src/grouplink.json'))
global.group = link.map((v, i) => `Group ${i + 1}\n${v}`).join('\n\n');
global.numberowner = '2349075341378'
global.nameowner = 'Akinade' //Owner name
global.name = 'A' // owner name for contacts
global.namebot = 'Elaina-MD' // bot name 
global.mail = 'adebisiakinade.123@gmail.com' // email or gmail
global.instagram = 'https://www.instagram.com/zuxxypml'//Instagram 
//global.community = {
  //game: '120363242705186427@g.us',
//}
global.partner = ''
global.menu = 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg' //image menu , but not work 
global.eror = '_*Server Error*_' // for eror message 
//global.rwait = '⌛' //wait message 
global.wait = '_*Tunggu sedang di proses...*_' //wait message 
global.wm = '*Elaina-MD*' // watermark bot 
global.playlist = '37i9dQZF1DWTwnEm1IYyoj' //song play list
const moment = require('moment-timezone') 


////// ALL of apikey ///////
//INI WAJIB DI ISI!//
global.lann = 'XwxIaeoY'
//Daftar terlebih dahulu https://api.betabotz.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
global.btc = 'PjoZNP4j'
//Daftar https://api.botcahx.eu.org 

global.APIs = { // API Prefix
  // name: 'https://website'
  nrtm: 'https://nurutomo.herokuapp.com',//git clone from nurutomo api and start node on dekstop
  nrtm2: 'http://localhost:5000', //just my local host
  xteam: 'https://api.xteam.xyz',//
  vhtear: 'https://api.vhtear.com',//
  lann: 'https://api.betabotz.eu.org',
  btc: 'https://api.botcahx.eu.org',
  lolhuman: 'http://api.lolhuman.xyz',//
  alya: 'https://api.alyachan.dev/'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.zeks.xyz': 'qyVJpszt0uSAL0lGCfOQIV3BVfp',
  'https://api.xteam.xyz': 'Syahrulidhamz30',
  'http://api.lolhuman.xyz': 'd5d9e369ab0bf0c231d43b17',
  'https://api.vhtear.com': 'Syahrulidhamz30',
  'https://api.betabotz.eu.org': 'XwxIaeoY',
  'https://api.botcahx.eu.org': 'PjoZNP4j',
  'https://api.alyachan.dev/': 'syah11'
}
global.footer = 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ A'
global.set = {
    footer: 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ A', //another watermark message?
    
}
//global.Func = new (require('./lib/functions')) //just function 
//global.scrap = new (require('./lib/scrape')) //just scraper 
global.packname = 'A' // another Watermark 
global.author = '⫹⫺ ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃' //watermark author?
global.htjava = pickRandom(["乂", "❏", "⫹⫺", "⎔", "✦", "⭔", "⬟"])
global.pmenus = pickRandom(["乂", "◈", "➭", "ଓ", "⟆•", "⳻", "•", "↬", "◈", "⭑", "ᯬ", "◉", "᭻", "»", "〆", "々", "✗", "♪"])

global.dtu = 'ɪɴꜱᴛᴀɢʀᴀᴍ'//just message 
global.urlnya = "-" //apa lah 

//============= callButtons =============//
global.dtc = 'ᴄᴀʟʟ ᴏᴡɴᴇʀ' //don't change 
global.phn = '+234 907-5341-378' //tell me it work 

global.multiplier = 69 // The higher, The harder level//

////// FOR TIME //////
let ngHour = moment.tz('Africa/Lagos').format('HH')
let ngMinute = moment.tz('Africa/Lagos').format('mm')
let ngSecond = moment.tz('Africa/Lagos').format('ss')
let wktung = `${ngHour} H ${ngMinute} M ${ngSecond} S`

let d = new Date();
let locale = 'en-US';

let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

let moodOfDay = {
  Monday: 'Hustle Day ���',
  Tuesday: 'Grind Day ���',
  Wednesday: 'Midweek Push ���',
  Thursday: 'Focus Day ���',
  Friday: 'Jummah + Vibes ������',
  Saturday: 'Rest and Flex ���️���',
  Sunday: 'Recharge Day ������'
}

let todayMood = moodOfDay[week] || 'Blessed Day ���'

global.botdate = `⫹⫺ Day: ${week}, ${date} - Mood: ${todayMood}`
global.bottime = `ᴛɪᴍᴇ: ${wktung}`

global.ucap = greeting;

function greeting() {
  const hr = parseInt(moment.tz('Africa/Lagos').format('HH')); // Nigerian time
  let greet;
  if (hr >= 2 && hr < 10) {
    greet = 'Good Morning ���️���️';
  } else if (hr >= 10 && hr <= 14) {
    greet = 'Good Afternoon ☀️���️';
  } else if (hr > 14 && hr <= 17) {
    greet = 'Good Evening ⛅���';
  } else {
    greet = 'Good Night ������';
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

