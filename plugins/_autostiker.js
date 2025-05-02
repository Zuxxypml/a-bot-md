const { sticker } = require("../lib/sticker");
const WSF = require("wa-sticker-formatter");

let handler = (m) => m;

handler.before = async function (m) {
  const chat = global.db.data.chats[m.chat];
  const user = global.db.data.users[m.sender];

  // Auto Sticker - USER BASED
  if (
    user.autosticker &&
    !user.banned &&
    !chat.isBanned &&
    !m.fromMe &&
    !m.isBaileys
  ) {
    if (/^.*s(tic?ker)?(gif)?$/i.test(m.text)) return;

    let q = m;
    let mime = (q.msg || q).mimetype || "";
    let stiker = false;
    let wsf = false;

    if (/webp/.test(mime)) return;

    if (/image/.test(mime)) {
      let img = await q.download();
      if (!img) return;
      wsf = new WSF.Sticker(img, {
        pack: global.packname,
        author: global.author,
        crop: false,
      });
    } else if (/video/.test(mime)) {
      if ((q.msg || q).seconds > 11)
        return m.reply("Max duration is 10 seconds!");
      let vid = await q.download();
      if (!vid) return;
      wsf = new WSF.Sticker(vid, {
        pack: global.packname,
        author: global.author,
        crop: true,
      });
    } else if (m.text.split` `[0]) {
      let url = m.text.split` `[0];
      if (isUrl(url))
        stiker = await sticker(false, url, global.packname, global.author);
    }

    if (wsf) {
      await wsf.build();
      const sticBuffer = await wsf.get();
      if (sticBuffer)
        await this.sendMessage(m.chat, { sticker: sticBuffer }, { quoted: m });
    }

    if (stiker)
      await this.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
  }

  return true;
};

module.exports = handler;

const isUrl = (text) => {
  return text.match(/https?:\/\/[^\s]+/gi);
};
