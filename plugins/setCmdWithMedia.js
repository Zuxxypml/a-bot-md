const MAX_CMD = 20;

module.exports = Object.assign(
  async function handler(m, { conn, text, isPrems, isROwner }) {
    // Only premium users can set custom sticker commands
    if (!isPrems) {
      global.dfail("premium", m, conn);
      throw false;
    }

    // Track how many commands the user has set
    const user = db.data.users[m.sender];
    if ((user.amount_cmd || 0) >= MAX_CMD) {
      throw "❌ You have reached the maximum number of custom commands.";
    }

    // Ensure the sticker command storage exists
    global.db.data.sticker = global.db.data.sticker || {};

    // Require a quoted sticker message
    if (!m.quoted) throw "❗ Please reply to a sticker message!";
    if (!m.quoted.fileSha256) throw "❗ Sticker SHA256 hash not found.";
    if (!text) throw "❗ No text provided for the command.";

    const stickerData = global.db.data.sticker;
    const hash = Buffer.from(m.quoted.fileSha256).toString("hex");

    // Prevent edits if the command is locked
    if (stickerData[hash]?.locked) {
      throw "❌ You do not have permission to change this sticker command.";
    }

    // Save the new command
    stickerData[hash] = {
      text,
      mentionedJid: m.mentionedJid,
      creator: m.sender,
      at: Date.now(),
      locked: false,
    };

    // Increment the user's command count if they're not the root owner
    if (!isROwner) {
      user.amount_cmd = (user.amount_cmd || 0) + 1;
    }

    // Confirm and show remaining allowance
    m.reply(
      `✅ Done!\n` +
        `You have ${
          MAX_CMD - (user.amount_cmd || 0)
        } custom commands remaining.`
    );
  },
  {
    help: ["setcmd <text>"],
    tags: ["cmd"],
    command: ["setcmd"],
  }
);
