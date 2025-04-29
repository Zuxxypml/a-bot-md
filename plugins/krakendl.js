const krakens = require("../lib/krakendl.js");
const fetch = require("node-fetch");
const filesize = require("filesize");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `🚀 *KrakenFiles Downloader*\n\nPlease provide a KrakenFiles URL\nExample: ${usedPrefix}${command} https://krakenfiles.com/view/neTIvR1wIz/file.html`;

  try {
    // Show waiting message
    await m.reply("⏳ Downloading file info from KrakenFiles...");

    const res = await krakens.download(text);
    if (res.error) throw new Error(res.error);

    // Get file details
    const fileInfo = await fetch(res.downloadLink, { method: "HEAD" });
    const fileSize = fileInfo.headers.get("content-length");
    const lastModified = fileInfo.headers.get("last-modified");
    const contentType = fileInfo.headers.get("content-type");

    // Format message
    let msg = `⚡ *K R A K E N   D O W N L O A D E R*\n\n`;
    msg += `📄 *Name*: ${res.fileName || "Unknown"}\n`;
    msg += `📦 *Size*: ${fileSize ? filesize(fileSize) : "Unknown"}\n`;
    msg += `📌 *Type*: ${contentType || "Unknown"}\n`;
    msg += `⏰ *Uploaded*: ${lastModified || "Unknown"}\n`;
    msg += `🔗 *Download*: Available\n\n`;
    msg += `_Downloading file..._`;

    // Send thumbnail and info
    await conn.sendFile(m.chat, res.thumbnail, "thumbnail.jpg", msg, m);

    // Send the actual file
    await conn.sendMessage(
      m.chat,
      {
        document: {
          url: res.downloadLink,
        },
        fileName: res.fileName,
        mimetype: contentType,
        caption: `✅ *Download Complete*\n${res.fileName}`,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("KrakenDL Error:", e);
    throw `❌ Download failed!\n${
      e.message || "Please check the URL and try again"
    }`;
  }
};

handler.help = ["krakendl <url>"];
handler.tags = ["downloader", "tools"];
handler.command = /^(krakendl|kraken(dl|download))$/i;
handler.limit = true;
handler.premium = false;

module.exports = handler;
