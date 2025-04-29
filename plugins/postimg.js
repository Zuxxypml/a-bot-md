const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function postimg(buffer) {
  try {
    const data = new FormData();
    data.append('optsize', '0');
    data.append('expire', '0');
    data.append('numfiles', '1');
    data.append('upload_session', Math.random());
    data.append('file', buffer, `${Date.now()}.jpg`);

    const res = await axios.post('https://postimages.org/json/rr', data);
    const html = await axios.get(res.data.url);
    const $ = cheerio.load(html.data);

    const link = $('#code_html').attr('value');
    const image = $('#code_direct').attr('value');
    const delimg = $('#code_remove').attr('value');

    return { link, image, delimg };
  } catch (err) {
    throw new Error('Upload failed: ' + err.message);
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || '';

    if (!/image/.test(mime)) {
      return m.reply(`❗ Send an image with the caption *${usedPrefix}postimg* or reply to an image.`);
    }

    const media = await q.download();
    m.reply('⏳ Uploading image, please wait...');

    const result = await postimg(media);

    const caption = `✅ *Image Uploaded Successfully!*\n\n` +
                    `🌐 *HTML Embed:* ${result.link}\n` +
                    `🖼️ *Direct Link:* ${result.image}\n` +
                    `❌ *Delete Link:* ${result.delimg}`;

    await conn.sendMessage(m.chat, { image: { url: result.image }, caption }, { quoted: m });
  } catch (e) {
    m.reply(`❌ *Failed to upload image:*\n${e.message}`);
  }
};

handler.help = ['postimg'];
handler.tags = ['tools'];
handler.command = ['postimg'];
handler.limit = false;

module.exports = handler;
