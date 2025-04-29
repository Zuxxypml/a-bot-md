const fg = require("api-dylux");
const fetch = require("node-fetch");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Please provide a Facebook video URL!\n\nExample:\n${usedPrefix}${command} https://www.facebook.com/share/r/ZM2xDeQdQ5y31jR5/?mibextid=D5vuiz`;
  }

  try {
    if (!/facebook/gi.test(args[0])) {
      throw `Only Facebook URLs are allowed!`;
    }

    conn.reply(m.chat, "Fetching your video... Please wait ⏳", m);

    const response = await fg.fbdl(args[0]);
    const { videoUrl, size, title } = response;

    let vid = videoUrl;
    let caption = `⬣───「 *FACEBOOK VIDEO* 」───⬣
○ *Title:* ${title}
○ *Size:* ${size}
○ *Download Link:* ${readMore}
${videoUrl}`;

    await conn.sendFile(m.chat, vid, "facebook.mp4", caption, m, null, {
      asDocument: global.db.data.users[m.sender].useDocument,
    });
  } catch (e) {
    console.error(e);
    throw "*Unable to retrieve video information. Please make sure the URL is valid!*";
  }
};

handler.help = ["facebook <url>"];
handler.tags = ["downloader"];
handler.command = /^((facebook|fb)(downloader|dl)?)$/i;

module.exports = handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
