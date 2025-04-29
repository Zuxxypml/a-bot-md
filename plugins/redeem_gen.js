const fs = require("fs");
const path = require("path");

// Point at <project-root>/src/code_redeem.json
const DATA_FILE = path.resolve(process.cwd(), "src", "code_redeem.json");

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    // if file missing or corrupt, initialize to a sane default
    return { group: { trial: [], half: [], one: [], two: [], used: [] } };
  }
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

let handler = async (m, { text, usedPrefix }) => {
  const data = loadData();
  const {
    trial = [],
    half = [],
    one = [],
    two = [],
    used = [],
  } = data.group || {};

  const codePools = { trial, half, one, two };
  const types = Object.keys(codePools);
  const type = (text || "").trim();

  if (!types.includes(type)) {
    return m.reply(
      "⚠️ Invalid type!\nAvailable types:\n" +
        types.map((t, i) => `${i + 1}. ${t}`).join("\n")
    );
  }

  const pool = codePools[type];
  if (!pool.length) {
    return m.reply(`⚠️ No codes available for type "${type}".`);
  }
  if (used.length >= pool.length) {
    return m.reply(`⚠️ All "${type}" codes have already been used.`);
  }

  // pick a fresh one
  let code;
  do {
    code = pool[Math.floor(Math.random() * pool.length)];
  } while (used.includes(code));

  data.group.used = [...used, code];
  saveData(data);

  await m.reply(
    `*Type:* ${type}\n\n` +
      `_How to use:_ Copy the code below and paste it into the group to activate the bot._\n\n` +
      `*Note:* Make sure the bot is already added to your group.`
  );
  await m.reply(`${usedPrefix}use ${code}`);
};

handler.help = ["generatecode <type>"];
handler.tags = ["owner"];
handler.command = /^(gen(erate)?code)$/i;
handler.rowner = true;

module.exports = handler;
