const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const search = require("yt-search");
const path = require("path");
const agent = ytdl.createAgent(
  JSON.parse(fs.readFileSync("./lib/coklat.json"))
);

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `💡 *Example:* ${usedPrefix}${command} Metamorphosis Slowed`
    );

  await conn.sendMessage(m.chat, {
    react: { text: "🕒", key: m.key },
  });

  try {
    const results = await search(text);
    const videoId = results.videos[0].videoId;
    const info = await ytdl.getInfo(videoId, { agent });

    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const url = info.videoDetails.video_url;
    const duration = parseInt(info.videoDetails.lengthSeconds);
    const uploadDate = new Date(
      info.videoDetails.publishDate
    ).toLocaleDateString();
    const views = info.videoDetails.viewCount;
    const description = results.videos[0].description;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const durationText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    const viewsFormatted = formatViews(views);

    const inputFilePath = `tmp/${title}.webm`;
    const outputFilePath = `tmp/${title}.mp3`;
    const audioStream = ytdl(videoId, { quality: "highestaudio", agent });

    const infoText = `
╭─ •  *P L A Y*
│ ◦ *Title*: ${title}
│ ◦ *Duration*: ${durationText}
│ ◦ *Upload*: ${uploadDate}
│ ◦ *Views*: ${viewsFormatted}
│ ◦ *ID*: ${videoId}
╰──── •
`.trim();

    // Send preview message with thumbnail and description
    await conn.relayMessage(
      m.chat,
      {
        extendedTextMessage: {
          text: infoText,
          contextInfo: {
            externalAdReply: {
              title: `🎵 P L A Y`,
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

    // Pipe and convert to mp3
    fs.mkdirSync("tmp", { recursive: true });
    const writeStream = fs.createWriteStream(inputFilePath);
    audioStream.pipe(writeStream).on("finish", async () => {
      ffmpeg(inputFilePath)
        .toFormat("mp3")
        .on("end", async () => {
          const buffer = fs.readFileSync(outputFilePath);
          const fileName = `${title}.mp3`;

          await conn.sendFile(m.chat, buffer, fileName, "", m); // normal
          await conn.sendFile(m.chat, buffer, fileName, "", m, null, {
            asDocument: true,
          }); // as document

          // Clean up
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .on("error", (err) => {
          console.error(err);
          m.reply(`❌ Error converting audio: ${err.message}`);
          if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
          if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
        })
        .save(outputFilePath);
    });
  } catch (e) {
    console.error(e);
    m.reply(`❌ Error searching or downloading audio: ${e.message}`);
  }
};

handler.command = handler.help = ["play", "song"];
handler.tags = ["downloader"];
handler.premium = false;
handler.limit = false;

module.exports = handler;

// Helper function
function formatViews(views) {
  views = parseInt(views);
  if (views >= 1e6) return (views / 1e6).toFixed(1) + "M";
  if (views >= 1e3) return (views / 1e3).toFixed(1) + "K";
  return views.toString();
}
