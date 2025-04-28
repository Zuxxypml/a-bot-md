const speed = require("performance-now");
const { exec } = require("child_process");

let handler = async (m, { conn }) => {
  // React with a clock emoji while measuring
  conn.sendMessage(m.chat, {
    react: {
      text: "🕒",
      key: m.key,
    },
  });

  let timestamp = speed();
  let latency = speed() - timestamp;

  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return m.reply("Error fetching system info.");
    }
    let systemInfo = stdout.toString("utf-8").replace(/Memory:/, "RAM:");
    conn.reply(
      m.chat,
      `${systemInfo}\n\n*Bot Speed:* ${latency.toFixed(4)} ms`,
      m
    );
  });
};

handler.command = ["ping", "speed", "quickping"]; // Allow triggering with common ping commands
handler.tags = ["info"];
handler.help = ["ping", "speed", "quickping"];

module.exports = handler;
