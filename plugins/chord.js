let fetch = require("node-fetch");
let handler = async (m, { text, usedPrefix }) => {
  if (!text) throw `Type ${usedPrefix}chord song title`;
  let res = await fetch(
    global.API("lolhuman", "/api/chord", { query: text }, "apikey")
  );
  if (!res.ok) throw "Server Error. Please report to the owner";
  let json = await res.json();
  if (!json.result.title) throw "Song not found";
  let { title, chord } = json.result;
  let chords = `
*Title:* ${title}

${chord}
`.trim();
  m.reply(chords);
};

handler.help = ["chord <song title>"];
handler.tags = ["media", "search"];
handler.command = /^(chord)$/i;

module.exports = handler;
