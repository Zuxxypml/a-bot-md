// Downloader module
const { ytIdRegex, yta, ytv } = require("../lib/y2mate");
const fetch = require("node-fetch");
const fg = require("api-dylux");
const { tiktokdl } = require("tiktokdl");
const { youtubedl, savefrom, instagramdl } = require("@bochilteam/scraper");

let errorMsg = `Invalid link!`;
let acceptedMsg = `Link accepted!`;
const canDownload =
  "You can download this link directly without typing any commands!\nJust send the link directly into this chat.";

let handler = (m) => m;

handler.before = async function (m, { isPrems, match }) {
  let chat = db.data.chats[m.chat];
  let user = db.data.users[m.sender];
  let set = db.data.settings[this.user.jid];

  if (chat.isBanned || user.banned || m.isBaileys) return;

  conn.autodl = conn.autodl || {};
  if (m.sender in conn.autodl) {
    delete conn.autodl[m.sender];
    return;
  }

  // TikTok Downloader
  if (/https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com/i.test(m.text)) {
    if (/..?(t(ik)?t(ok)?2?) /i.test(m.text)) return m.reply(canDownload);
    let link = (m.text.match(
      /https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com\/.*/i
    ) || [])[0]?.split(/\n| /i)[0];
    if (!link) return;

    m.reply(acceptedMsg);
    let tt = await tiktokdl(link);
    const { video, music } = tt;

    await conn.sendFile(
      m.chat,
      video,
      `${new Date() * 1}.mp4`,
      "*TikTok Video Downloaded*",
      m,
      null,
      { asDocument: global.db.data.users[m.sender].useDocument }
    );
    await conn.sendFile(
      m.chat,
      music,
      `${new Date() * 1}.mp3`,
      "*TikTok Music Downloaded*",
      m,
      null,
      { asDocument: global.db.data.users[m.sender].useDocument }
    );
    return true;
  }

  // Instagram Downloader
  if (/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)/i.test(m.text)) {
    if (/..?(ig|instagram)2? /i.test(m.text)) return m.reply(canDownload);
    let link = (m.text.match(
      /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.*/i
    ) || [])[0]?.split(/\n| /i)[0];
    if (!link) return;

    m.reply(acceptedMsg);
    let ig = await fetch(global.API("alya", "api/ig", { url: link }, "apikey"));
    let res = await ig.json();
    let media = res.data;

    await m.reply("_Sending files, please wait..._");
    for (let { type, url } of media) {
      await conn.sendFile(
        m.chat,
        url,
        `ig.${type == "image" ? "jpg" : "mp4"}`,
        "",
        m,
        null,
        { asDocument: global.db.data.users[m.sender].useDocument }
      );
    }
    return;
  }

  // YouTube Downloader
  if (ytIdRegex.test(m.text)) {
    if (/..?youtu/i.test(m.text)) return m.reply(canDownload);

    let yt = await youtubedl(m.text);
    let audio = yt.audio["128kbps"];
    let video = yt.video["360p"];
    let { fileSize, fileSizeH } = video;

    let audiodl = await audio.download();
    let videodl = await video.download();

    let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < fileSize;
    conn.reply(
      m.chat,
      `
${
  isLimit
    ? `
*Source:* ${m.text}
*File Size:* ${fileSizeH}
_File too large, download directly using browser links:_
Video: ${videodl.toString()}
Audio: ${audiodl.toString()}`
    : "_Sending the files, please wait..._"
}
`.trim(),
      {
        key: {
          remoteJid: "status@broadcast",
          participant: "0@s.whatsapp.net",
          fromMe: false,
        },
        message: {
          imageMessage: {
            mimetype: "image/jpeg",
            caption: `
*Title:* ${yt.title}
*File Size:* ${fileSizeH}`.trim(),
            jpegThumbnail: await (await fetch(yt.thumbnail)).buffer(),
          },
        },
      }
    );

    if (!isLimit) {
      await conn.sendFile(m.chat, audiodl, `${yt.title}.mp3`, "", m, null, {
        asDocument: true,
      });
      await conn.sendFile(m.chat, videodl, `${yt.title}.mp4`, "", m, null, {
        asDocument: true,
      });
    }
  }

  delete conn.autodl[m.sender];
  return true;
};

module.exports = handler;
