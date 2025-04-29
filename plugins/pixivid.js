const { URL_REGEX } = require("@whiskeysockets/baileys");
const { fromBuffer } = require("file-type");
const { Pixiv } = require("@ibaraki-douji/pixivts");
const pixiv = new Pixiv();

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("_*Please provide a Pixiv link or tag!*_");

  await conn.sendMessage(m.chat, {
    react: { text: "🕒", key: m.key },
  });

  try {
    let res = await pixivDl(text);
    for (let i = 0; i < res.media.length; i++) {
      let caption =
        i === 0
          ? `╭──── 〔 P I X I V 〕 ─⬣\n` +
            `⬡ *Title* : ${res.caption}\n` +
            `⬡ *Artist* : ${res.artist}\n` +
            `⬡ *Tags* : ${res.tags.join(", ")}\n╰────────⬣\n`
          : "";

      let mime = (await fromBuffer(res.media[i])).mime;
      let mediaType = mime.split("/")[0];

      if (mediaType === "image") {
        if (mime === "image/gif") {
          await conn.sendMessage(
            m.chat,
            {
              video: res.media[i],
              caption,
              mimetype: "video/mp4",
              gifPlayback: true,
            },
            { quoted: m }
          );
        } else {
          await conn.sendMessage(
            m.chat,
            {
              image: res.media[i],
              caption,
              mimetype: mime,
            },
            { quoted: m }
          );
        }
      } else if (mediaType === "video") {
        await conn.sendMessage(
          m.chat,
          {
            video: res.media[i],
            caption,
            mimetype: mime,
          },
          { quoted: m }
        );
      }

      await conn.sendMessage(m.chat, {
        react: { text: "✅", key: m.key },
      });
    }
  } catch (e) {
    console.error(e);
    m.reply(
      `❌ *An error occurred while downloading the Pixiv image:* ${e.message}`
    );
  }
};

handler.help = ["pixiv <url or tag>"];
handler.tags = ["downloader", "image"];
handler.command = /^(pixiv|pixivdl)$/i;
handler.limit = 1;
handler.register = true;

module.exports = handler;

async function pixivDl(query) {
  if (query.match(URL_REGEX)) {
    if (!/https:\/\/www\.pixiv\.net\/en\/artworks\/\d+/i.test(query))
      return null;

    query = query.replace(/\D/g, "");
    let res = await pixiv.getIllustByID(query).catch(() => null);
    if (!res) throw new Error(`No results found.`);

    let media = [];
    for (let url of res.urls) {
      media.push(await pixiv.download(new URL(url.original)));
    }

    return {
      artist: res.user.name,
      caption: res.title,
      tags: res.tags.tags.map((v) => v.tag),
      media,
    };
  } else {
    let res = await pixiv.getIllustsByTag(query);
    if (!res.length) throw new Error(`No results found.`);

    let randomId = res[Math.floor(Math.random() * res.length)].id;
    let info = await pixiv.getIllustByID(randomId);

    let media = [];
    for (let url of info.urls) {
      media.push(await pixiv.download(new URL(url.original)));
    }

    return {
      artist: info.user.name,
      caption: info.title,
      tags: info.tags.tags.map((v) => v.tag),
      media,
    };
  }
}
