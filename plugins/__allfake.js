let fs = require("fs");
let fetch = require("node-fetch");

let waifu = JSON.parse(fs.readFileSync("./api/waifu.json"));
let handler = (m) => m;

handler.all = async function (m) {
  let pp = "https://telegra.ph/file/2d06f0936842064f6b3bb.png";
  try {
    pp = await this.profilePictureUrl(m.sender, "image");
  } catch (e) {
    // fallback if error
  } finally {
    global.img = this.pickRandom(waifu);
    global.bg = await (await fetch(global.img)).buffer();
    global.doc = this.pickRandom([
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/pdf",
    ]);

    global.fetch = fetch;
    const _uptime = process.uptime() * 1000;
    global.u = await conn.clockString(_uptime);

    global.ephemeral = "86400"; // 24 hours

    let ad = this.pickRandom([
      {
        body: "Follow IG Owner",
        sourceUrl: "https://instagram.com/syahrul_idh",
      },
      { body: "GC BOT", sourceUrl: this.pickRandom(global.link || []) },
    ]);

    global.adReply = {
      contextInfo: {
        externalAdReply: {
          title: this.user.name,
          thumbnail: fs.readFileSync("./src/logo.jpg"),
          ...ad,
        },
      },
    };

    global.fakeImgReply = {
      quoted: {
        key: {
          remoteJid: "status@broadcast",
          participant: m?.sender || "0@s.whatsapp.net",
        },
        message: {
          imageMessage: {
            mimetype: "image/jpeg",
            caption: m?.text || "",
            jpegThumbnail: fs.readFileSync("./src/logo.jpg"),
          },
        },
      },
    };

    global.ftroli = {
      key: { remoteJid: "status@broadcast", participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 9999,
          status: 1,
          surface: 1,
          message: global.wm || "Fake Bot",
          orderTitle: global.wm || "Fake Bot",
          sellerJid: "0@s.whatsapp.net",
        },
      },
    };

    global.fkontak = {
      key: {
        participant: "0@s.whatsapp.net",
        ...(m.chat ? { remoteJid: "status@broadcast" } : {}),
      },
      message: {
        contactMessage: {
          displayName: global.wm || "Fake Bot",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${
            global.wm || "Fake Bot"
          };;;\nFN:${global.wm || "Fake Bot"}\nitem1.TEL;waid=${
            (m?.sender || "0").split("@")[0]
          }:${
            (m?.sender || "0").split("@")[0]
          }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          jpegThumbnail: fs.readFileSync("./src/logo.jpg"),
          sendEphemeral: true,
        },
      },
    };
  }
};

module.exports = handler;
