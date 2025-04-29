const { fetch } = require("undici");
const { lookup } = require("mime-types");
const cheerio = require("cheerio");

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text)
    return m.reply(`*Example:* ${usedPrefix + command} [mediafire-url]`);

  const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.+$/i;
  if (!mediafireRegex.test(text)) {
    return m.reply(
      `Please provide a valid MediaFire URL\n*Example:* ${
        usedPrefix + command
      } https://www.mediafire.com/file/example`
    );
  }

  try {
    m.reply("⏳ Downloading file from MediaFire...");

    let result = await mediafire(text);
    if (!result || !result.download)
      throw new Error("Failed to retrieve download link");

    let caption =
      `*MediaFire Downloader*\n\n` +
      `📁 File Name: ${result.filename}\n` +
      `📦 File Type: ${result.type}\n` +
      `📏 File Size: ${result.size}\n` +
      `⚡ Downloading...`;

    await conn.sendFile(
      m.chat,
      result.download,
      result.filename,
      caption,
      m,
      false,
      {
        mimetype: result.mimetype,
        fileName: result.filename,
        asDocument: true,
      }
    );
  } catch (e) {
    console.error("MediaFire Download Error:", e);
    m.reply(
      "❌ Failed to download file. Possible reasons:\n" +
        "- Invalid or private link\n" +
        "- MediaFire server error\n" +
        "- File no longer exists"
    );
  }
};

handler.help = ["mediafire", "mf"].map((a) => a + " [mediafire-url]");
handler.tags = ["downloader"];
handler.command = ["mediafire", "mf"];
handler.limit = true;

module.exports = handler;

async function mediafire(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch MediaFire page");

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract file information
    const type =
      $(".dl-btn-cont")
        .find(".icon")
        .attr("class")
        ?.split("archive")[1]
        ?.trim() || "Unknown";
    const filename = $(".dl-btn-label").attr("title") || "Unknown";
    const sizeMatch = $(".download_link .input")
      .text()
      .trim()
      .match(/\((.*?)\)/);
    const size = sizeMatch ? sizeMatch[1] : "Unknown";
    const ext = filename.split(".").pop() || "bin";
    const mimetype = lookup(ext.toLowerCase()) || "application/octet-stream";
    const download = $(".input").attr("href");

    if (!download) throw new Error("No download link found");

    return {
      filename,
      type,
      size,
      ext,
      mimetype,
      download,
    };
  } catch (e) {
    console.error("MediaFire Parser Error:", e);
    throw new Error("Failed to process MediaFire link");
  }
}
