const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const search = require("yt-search");
const path = require("path");

// Resolve everything from project root
const PROJECT_ROOT = process.cwd();
const COKLAT_CONFIG = path.resolve(PROJECT_ROOT, "lib", "coklat.json");
const TMP_DIR = path.resolve(PROJECT_ROOT, "tmp");

// Load your custom agent config
const agentOptions = JSON.parse(fs.readFileSync(COKLAT_CONFIG, "utf8"));
const agent = ytdl.createAgent(agentOptions);

// Ensure tmp folder exists
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `💡 *Example:* ${usedPrefix}${command} Metamorphosis Slowed`
    );
  }

  // Show “typing” reaction
  await conn.sendMessage(m.chat, {
    react: { text: "🕒", key: m.key },
  });

  try {
    // 1) Search YouTube
    const results = await search(text);
    const video = results.videos[0];
    if (!video) throw new Error("No results found");

    const videoId = video.videoId;
    const info = await ytdl.getInfo(videoId, { agent });

    // 2) Build metadata
    const rawTitle = info.videoDetails.title;
    const title = rawTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").slice(0, 50);
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const url = info.videoDetails.video_url;
    const durationSec = parseInt(info.videoDetails.lengthSeconds, 10);
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;
    const durationText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    const views = formatViews(info.videoDetails.viewCount);
    const uploadDate = new Date(
      info.videoDetails.publishDate
    ).toLocaleDateString();
    const description = video.description || "";

    // 3) Send a rich preview
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

    // 4) Download audio and save to tmp
    const inputPath = path.join(TMP_DIR, `${title}.webm`);
    const outputPath = path.join(TMP_DIR, `${title}.mp3`);
    await new Promise((resolve, reject) => {
      ytdl(videoId, { quality: "highestaudio", agent })
        .pipe(fs.createWriteStream(inputPath))
        .on("finish", resolve)
        .on("error", reject);
    });

    // 5) Convert with ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("mp3")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    // 6) Send back both as audio & as document
    const buffer = fs.readFileSync(outputPath);
    const fileName = `${title}.mp3`;

    await conn.sendFile(m.chat, buffer, fileName, "", m);
    await conn.sendFile(m.chat, buffer, fileName, "", m, null, {
      asDocument: true,
    });

    // 7) Cleanup
    [inputPath, outputPath].forEach((f) => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
  } catch (err) {
    console.error(err);
    // Attempt cleanup on error
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

// Helper: human-readable view count
function formatViews(views) {
  const n = parseInt(views, 10);
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}
