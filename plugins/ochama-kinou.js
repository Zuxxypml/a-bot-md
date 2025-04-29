let handler = async (m, { conn }) => {
  // Lyrics/messages to be displayed in sequence
  let messages = [
    "Itsudemo I love you",
    "Kimi ni Take Kiss Me",
    "Wasurerarenai kara",
    "Boku no daiji na memory",
    "Dorayaki wa",
    "Shūshoku ni narenai",
    "Naraba uwagaki shichaeba",
    "Boku no omoi dōri",
  ];

  // Send the first message to retrieve its key for editing
  let { key } = await conn.sendMessage(m.chat, { text: messages[0] });

  // Timed intervals (in ms) for editing messages
  let timeIntervals = [0, 1200, 2100, 3000, 4200, 4800, 5700, 6600];

  for (let i = 1; i < messages.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, timeIntervals[i]));
    await conn.sendMessage(m.chat, { text: messages[i], edit: key });
  }
};

handler.help = ["ochama-kinou"];
handler.tags = ["main"];
handler.command = /^(ochama-kinou)$/i;

module.exports = handler;

// Unused function (can be removed unless needed for future use)
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}
