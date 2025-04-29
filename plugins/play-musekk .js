let limit = 30;
let yts = require("yt-search");
let fetch = require("node-fetch");
const { servers, yta, ytv } = require("../lib/y2mate");

let handler = async (
  m,
  { conn, command, text, isPrems, isOwner, usedPrefix }
) => {
  let query = text || m.quoted?.text;
  if (!query) throw `🎵 *Please reply with or type the song title.*`;

  m.reply(`🔍 Searching for *${query}*...`);

  let results = await yts(query);
  let video = results.all.find((v) => v.seconds < 900); // under 15 mins

  if (!video) throw `❌ No suitable song found.`;

  let isVideo = /2$/.test(command); // check if it's for video (not used here)
  let yt = false;
  let usedServer = servers[0];

  for (let server of servers) {
    try {
      yt = await (isVideo ? ytv : yta)(video.url, server);
      usedServer = server;
      break;
    } catch (err) {
      m.reply(`⚠️ Server ${server} failed. Trying another...`);
    }
  }

  if (!yt) throw "❌ All servers failed. Please try again later.";

  let { dl_link, thumb, title, filesize, filesizeF } = yt;
  let sizeLimit = (isPrems || isOwner ? 99 : limit) * 1024;
  let overLimit = filesize > sizeLimit;

  await m.reply(
    `
🎶 *Title:* ${title}
🔗 *Source:* ${video.url}
📦 *File Size:* ${filesizeF}
${overLimit ? `⚠️ File too large. Download manually: ${dl_link}` : ""}
`.trim()
  );

  let thumbnail = {};
  try {
    if (isVideo) thumbnail = { thumbnail: await (await fetch(thumb)).buffer() };
  } catch (e) {}

  if (!overLimit) {
    await conn.sendFile(m.chat, dl_link, `${title}.mp3`, null, m, true, {
      mimetype: "audio/mp4",
      ...thumbnail,
    });
  }
};

handler.command = /^playy$/i;
handler.exp = 0;
handler.limit = true;

module.exports = handler;
