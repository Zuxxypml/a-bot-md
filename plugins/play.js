const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const search = require("yt-search");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const COKLAT_CONFIG = path.resolve(PROJECT_ROOT, "lib", "coklat.json");
const TMP_DIR = path.resolve(PROJECT_ROOT, "tmp");

const agentOptions = JSON.parse(fs.readFileSync(COKLAT_CONFIG, "utf8"));
const agent = ytdl.createAgent(agentOptions);

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `💡 *Example:* ${usedPrefix}${command} Metamorphosis Slowed`
    );

  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    const results = await search(text);
    const video = results.videos[0];
    if (!video) throw new Error("No results found");

    const videoId = video.videoId;
    const info = await ytdl.getInfo(videoId, { agent });

    const rawTitle = info.videoDetails.title;
    const title = rawTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").slice(0, 50);
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const url = info.videoDetails.video_url;
    const durationSec = parseInt(info.videoDetails.lengthSeconds, 10);
    const durationText = `${Math.floor(durationSec / 60)}:${String(
      durationSec % 60
    ).padStart(2, "0")}`;
    const views = formatViews(info.videoDetails.viewCount);
    const uploadDate = new Date(
      info.videoDetails.publishDate
    ).toLocaleDateString();
    const description = video.description || "";

    const infoText = `
╭─ •  *P L A Y*
│ ◦ *Title*: ${rawTitle}
│ ◦ *Duration*: ${durationText}
│ ◦ *Upload*: ${uploadDate}
│ ◦ *Views*: ${views}
│ ◦ *ID*: ${videoId}
╰──── •
`.trim();

    await conn.relayMessage(
      m.chat,
      {
        extendedTextMessage: {
          text: infoText,
          contextInfo: {
            externalAdReply: {
              title: "🎵 P L A Y",
              body: description,
              mediaType: 1,
              previewType: 0,
              renderLargerThumbnail: true,
              thumbnailUrl,
              sourceUrl: url,
            },
          },
          mentions: [m.sender],
        },
      },
      {}
    );

    const inputPath = path.join(TMP_DIR, `${title}.webm`);
    const outputPath = path.join(TMP_DIR, `${title}.mp3`);

    await new Promise((resolve, reject) => {
      const stream = ytdl(videoId, { quality: "highestaudio", agent });
      const file = fs.createWriteStream(inputPath);
      stream.pipe(file);

      stream.on("error", (err) =>
        reject(new Error("Download error: " + err.message))
      );
      file.on("finish", () => {
        if (fs.existsSync(inputPath) && fs.statSync(inputPath).size > 0)
          resolve();
        else reject(new Error("Downloaded file is empty."));
      });
      file.on("error", (err) =>
        reject(new Error("File write error: " + err.message))
      );
    });

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("mp3")
        .on("start", (cmd) => console.log("FFMPEG CMD:", cmd))
        .on("error", (err) => reject(new Error("FFmpeg error: " + err.message)))
        .on("end", resolve)
        .save(outputPath);
    });

    const buffer = fs.readFileSync(outputPath);
    const fileName = `${title}.mp3`;

    await conn.sendFile(m.chat, buffer, fileName, "", m);
    await conn.sendFile(m.chat, buffer, fileName, "", m, null, {
      asDocument: true,
    });

    [inputPath, outputPath].forEach(
      (f) => fs.existsSync(f) && fs.unlinkSync(f)
    );
  } catch (err) {
    console.error(err);
    fs.readdirSync(TMP_DIR).forEach((file) => {
      if (file.endsWith(".webm") || file.endsWith(".mp3")) {
        fs.unlinkSync(path.join(TMP_DIR, file));
      }
    });
    m.reply(`❌ Error: ${err.message}`);
  }
};

handler.command = handler.help = ["play", "song"];
handler.tags = ["downloader"];
handler.premium = false;
handler.limit = false;

module.exports = handler;

function formatViews(views) {
  const n = parseInt(views, 10);
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}
