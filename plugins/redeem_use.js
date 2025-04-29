const fs = require("fs");

// Load existing group activations and redeem codes
let groupData = JSON.parse(fs.readFileSync("./src/group.json", "utf8"));
let redeemData = JSON.parse(fs.readFileSync("./src/code_redeem.json", "utf8"));

let trialCodes = redeemData.group.trial;
let halfCodes = redeemData.group.half;
let oneCodes = redeemData.group.one;
let twoCodes = redeemData.group.two;

// All possible codes
let allCodes = trialCodes.concat(halfCodes, oneCodes, twoCodes);

let handler = async (
  m,
  { conn, args, usedPrefix, participants, groupMetadata }
) => {
  // Prevent using master bot's code pool in its own group
  if (conn.user.jid !== global.conn.user.jid) {
    if (participants.map((v) => v.id).includes(global.conn.user.jid)) {
      throw "Cannot activate here: master bot is present.";
    }
  }

  let chatSettings = global.db.data.chats[m.chat];
  let newGroupEntry = {};
  let durationDays;

  // If already initialized, do not allow re-activation
  if (chatSettings.init) {
    throw "The bot is already active in this group.";
  }

  // Trial code cooldown check
  if (chatSettings.trial && trialCodes.includes(args[0])) {
    let retryIn = conn.msToDate(chatSettings.lastUse + 86400000 - Date.now());
    return conn.reply(
      m.chat,
      `⚠️ This group already used a 1-day trial.\n\n` +
        `You can retry after ${retryIn}.\n\n` +
        `Or activate with a premium code. Contact the owner to get/buy a redeem code.`,
      m
    );
  }

  // Ensure code argument present
  if (!args[0]) {
    throw `Please provide a redeem code.\nUsage: ${usedPrefix}use <code>`;
  }

  // Check if code was used
  if (redeemData.used.includes(args[0])) {
    throw "This code has already been used. Please obtain a new code from the owner.";
  }

  // Validate code exists
  if (!allCodes.includes(args[0])) {
    throw "Invalid code.";
  }

  // Determine activation duration based on code type
  if (trialCodes.includes(args[0])) {
    chatSettings.trial = true;
    durationDays = 3;
  }
  if (halfCodes.includes(args[0])) durationDays = 15;
  if (oneCodes.includes(args[0])) durationDays = 30;
  if (twoCodes.includes(args[0])) durationDays = 60;

  // Notify success
  await conn.reply(
    m.chat,
    `✅ Activation successful!\n` +
      `The bot will be active in *${groupMetadata.subject}* for ${durationDays} days.`,
    m
  );

  // Set group expiry timestamp
  chatSettings.gcdate = Date.now() + durationDays * 86400000;
  newGroupEntry.expired = Date.now() + durationDays * 86400000;

  // Save group info
  newGroupEntry.name = `${groupMetadata.subject} (${m.chat})`;
  newGroupEntry.owner_group = m.chat.split("-")[0];
  newGroupEntry.joiner = m.sender;
  chatSettings.init = true;

  // Mark code used and persist both files
  redeemData.used.push(args[0]);
  groupData.push(newGroupEntry);
  fs.writeFileSync("./src/group.json", JSON.stringify(groupData, null, 2));
  fs.writeFileSync("src/code_redeem.json", JSON.stringify(redeemData, null, 2));
};

handler.help = ["use <code>"];
handler.tags = ["group"];
handler.command = /^(use)$/i;
handler.group = true;

module.exports = handler;
