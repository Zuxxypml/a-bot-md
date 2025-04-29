const os = require("os");
const { performance } = require("perf_hooks");
const { sizeFormatter } = require("human-readable");

const format = sizeFormatter({
  std: "JEDEC", // Standard options: 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

let handler = async (m, { conn }) => {
  const chats = Object.keys(conn.chats);
  const groups = chats.filter((id) => id.endsWith("g.us"));

  // Measure response time
  const start = performance.now();
  await m.reply("_Measuring speed..._");
  const end = performance.now();
  const responseTime = ((end - start) / 1000).toFixed(2);

  // Retrieve CPU information
  const cpuInfo = os.cpus();

  // Send stats back to the chat
  await m.reply(
    `
╔══「 Responded in ${responseTime} seconds 」
║
╟ 💬 Status:
╟ Total Groups: *${groups.length}*
╟ Private Chats: *${chats.length - groups.length}*
╟ Total Chats: *${chats.length}*
║
╟ 💻 *Server Info*:
╟ Platform: ${os.platform()}
╟ CPU: *${cpuInfo[0].model}*
╟ Total Cores: *${cpuInfo.length}*
╟ CPU Speed: *${(cpuInfo[0].speed / 1000).toFixed(1)} GHz*
╟ RAM Usage: *${format(os.totalmem() - os.freemem())} / ${format(
      os.totalmem()
    )}*
╚════════════════
`.trim()
  );
};

handler.help = ["ping", "speed"];
handler.tags = ["info", "main"];
handler.command = /^(ping|speed)$/i;

module.exports = handler;
