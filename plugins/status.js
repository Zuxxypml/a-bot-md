// Define an asynchronous handler function that takes a message object and destructures 'command' from the second argument
let handler = async (m, { command }) => {
  // Determine who the target is - either mentioned user or message sender
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;

  // Check if the user is premium by looking them up in the global premium list
  let prem = global.prems.includes(who.split`@`[0]);

  // Get premium expiration date if user is premium
  let date = prem ? global.db.data.users[who].premdate : "";

  // Check if the command is group-related (starts with 'g', 'group', or 'gc')
  let gc = /g(roup|c)/i.test(command);

  // If it's a group command and the message is from a group
  if (gc && m.isGroup) {
    who = m.chat; // Set target to the group chat
    date = global.db.data.chats[m.chat].gcdate
      ? global.db.data.chats[m.chat].gcdate
      : "";
  }

  // Check if the group has permanent status
  let permanent = global.db.data.chats[who].permanent || "";

  // Get current timestamp
  let now = new Date() * 1;

  // Calculate remaining time
  let distance = date - now;

  let time;
  if (distance <= 0) {
    time = `_*The bot's active period in this group has expired*_`;
  } else {
    time = conn.msToDate(distance); // Convert milliseconds to readable date format
  }

  // Create status message string
  let str = `
Status : *${
    gc && permanent
      ? "Permanent Group"
      : gc
      ? "Active"
      : prem
      ? "Premium User"
      : "Regular User"
  }*${prem || gc ? "\nTime remaining: " + (permanent ? " Infinity" : time) : ""}
`.trim();

  // Reply with the status message
  m.reply(str);
};

// Define help text for the command
handler.help = ["statusgroup"];

// Add tags for categorization
handler.tags = ["group"];

// Define the command pattern (case insensitive)
// Matches: status, statusgroup, statusgc, etc.
handler.command = /^(status(g(roup|c))?)$/i;

// Export the handler for use in other modules
module.exports = handler;
