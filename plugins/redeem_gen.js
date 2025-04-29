const fs = require("fs");
const path = require("path");

// Load and write helper
const DATA_FILE = path.join(__dirname, "../src/code_redeem.json");
function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

let handler = async (m, { text, usedPrefix }) => {
  const data = loadData();
  const { trial, half, one, two, used } = data.group;
  const codePools = { trial, half, one, two };
  const types = Object.keys(codePools);

  const type = (text || "").trim();
  if (!types.includes(type)) {
    // List available types
    return m.reply(
      "⚠️ Invalid type!\nAvailable types:\n" +
        types.map((t, i) => `${i + 1}. ${t}`).join("\n")
    );
  }

  // Generate a fresh unused code
  let code;
  do {
    const pool = codePools[type];
    code = pool[Math.floor(Math.random() * pool.length)];
  } while (used.includes(code));

  // Mark it used and save
  data.group.used.push(code);
  saveData(data);

  // Reply to user
  await m.reply(
    `*Type:* ${type}\n\n` +
      `_How to use:_ Copy the code below and paste it into the group where you want to activate the bot._\n\n` +
      `*Note:* Make sure the bot is already added to your group.`
  );
  await m.reply(`${usedPrefix}use ${code}`);
};

handler.help = ["generatecode <type>"];
handler.tags = ["owner"];
handler.command = /^(gen(erate)?code)$/i;
handler.rowner = true;

module.exports = handler;
