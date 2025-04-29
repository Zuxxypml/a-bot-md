const fs = require("fs");
const path = require("path");

// Resolve files from your project root
const GROUP_FILE = path.resolve(process.cwd(), "src", "group.json");
const REDEEM_FILE = path.resolve(process.cwd(), "src", "code_redeem.json");

// Helpers to load & save
function loadJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return fallback;
  }
}
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

let handler = async (
  m,
  { conn, args, usedPrefix, participants, groupMetadata }
) => {
  // Load current state
  let groupData = loadJSON(GROUP_FILE, []);
  let redeemData = loadJSON(REDEEM_FILE, { group: {}, used: [] });

  const {
    trial = [],
    half = [],
    one = [],
    two = [],
    used = [],
  } = redeemData.group;

  const allCodes = [...trial, ...half, ...one, ...two];

  // Prevent using master bot's code pool in its own group
  if (conn.user.jid !== global.conn.user.jid) {
    if (participants.map((v) => v.id).includes(global.conn.user.jid)) {
      throw "Cannot activate here: master bot is present.";
    }
  }

  const chatSettings = (global.db.data.chats[m.chat] =
    global.db.data.chats[m.chat] || {});

  // Already activated?
  if (chatSettings.init) {
    throw "The bot is already active in this group.";
  }

  // Ensure code provided
  const code = args[0];
  if (!code) {
    throw `Please provide a redeem code.\nUsage: ${usedPrefix}use <code>`;
  }

  // Code already used?
  if (redeemData.used.includes(code)) {
    throw "This code has already been used. Please obtain a new code from the owner.";
  }

  // Code must exist
  if (!allCodes.includes(code)) {
    throw "Invalid code.";
  }

  // Trial cooldown?
  if (chatSettings.trial && trial.includes(code)) {
    let retryIn = conn.msToDate(chatSettings.lastUse + 86400000 - Date.now());
    return conn.reply(
      m.chat,
      `⚠️ This group already used a 1-day trial.\n\n` +
        `You can retry after ${retryIn}.\n\n` +
        `Or activate with a premium code. Contact the owner to get/buy a redeem code.`,
      m
    );
  }

  // Determine duration
  let durationDays;
  if (trial.includes(code)) {
    chatSettings.trial = true;
    durationDays = 3;
  } else if (half.includes(code)) {
    durationDays = 15;
  } else if (one.includes(code)) {
    durationDays = 30;
  } else if (two.includes(code)) {
    durationDays = 60;
  }

  // Activate
  await conn.reply(
    m.chat,
    `✅ Activation successful!\n` +
      `The bot will be active in *${groupMetadata.subject}* for ${durationDays} days.`,
    m
  );

  // Set expiry & mark init
  const expiry = Date.now() + durationDays * 86400000;
  chatSettings.gcdate = expiry;
  chatSettings.init = true;
  chatSettings.lastUse = Date.now();

  // Record in groupData
  groupData.push({
    name: `${groupMetadata.subject} (${m.chat})`,
    owner_group: m.chat.split("-")[0],
    joiner: m.sender,
    expired: expiry,
  });

  // Mark code used
  redeemData.used.push(code);

  // Persist both files
  saveJSON(GROUP_FILE, groupData);
  saveJSON(REDEEM_FILE, redeemData);

  // Don't forget to write to your in-memory DB too
  await global.db.write();
};

handler.help = ["use <code>"];
handler.tags = ["group"];
handler.command = /^(use)$/i;
handler.group = true;

module.exports = handler;
