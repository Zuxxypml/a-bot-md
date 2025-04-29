const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const { remini } = require("../lib/hdvid.js");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Validate input
  if (!text) {
    const example = `${usedPrefix}${command} 30`;
    return m.reply(`Please specify FPS value!\nExample: *${example}*`);
  }

  const fps = parseInt(text);
  if (isNaN(fps)) return m.reply("FPS must be a number!");
  if (fps > 30) return m.reply("Maximum FPS is 30!");

  // Check for quoted video
  const quoted = m.quoted || m;
  const mime = (quoted.msg || quoted).mimetype || "";
  if (!/video/.test(mime)) return m.reply("Please reply to a video!");
  if ((quoted.msg || quoted).seconds > 30) {
    return m.reply("Maximum video duration is 30 seconds!");
  }

  try {
    // Send processing message
    const processingMsg = await m.reply(
      "🔄 Processing video... This may take 5-15 minutes"
    );

    // Create directories
    const timestamp = Date.now();
    const baseDir = "tmp";
    const workDir = path.join(baseDir, m.sender);
    const resultDir = path.join(baseDir, `result-${m.sender}`);
    const framesDir = path.join(workDir, "frames", timestamp.toString());
    const enhancedFramesDir = path.join(
      resultDir,
      "frames",
      timestamp.toString()
    );
    const outputPath = path.join(resultDir, `${m.sender}-${timestamp}.mp4`);

    [
      baseDir,
      workDir,
      resultDir,
      path.dirname(framesDir),
      framesDir,
      path.dirname(enhancedFramesDir),
      enhancedFramesDir,
    ].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // Download video
    const videoPath = path.join(workDir, `${timestamp}.mp4`);
    const media = await conn.downloadAndSaveMediaMessage(quoted, videoPath);

    // Extract frames
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i ${media} -vf "fps=${fps}" ${framesDir}/frame-%04d.png`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("Frame Extraction Error:", stderr);
            reject(new Error("Failed to extract frames"));
          } else resolve();
        }
      );
    });

    // Enhance frames
    const frames = fs.readdirSync(framesDir);
    const enhancementPromises = frames.map((frame) => {
      const framePath = path.join(framesDir, frame);
      return remini(fs.readFileSync(framePath), "enhance")
        .then((enhanced) => {
          fs.writeFileSync(path.join(enhancedFramesDir, frame), enhanced);
        })
        .catch((err) => {
          console.error("Frame Enhancement Error:", err);
          throw new Error("Failed to enhance frames");
        });
    });

    await Promise.all(enhancementPromises);

    // Compile enhanced video
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -framerate ${fps} -i ${enhancedFramesDir}/frame-%04d.png ` +
          `-i ${media} -c:v libx264 -pix_fmt yuv420p -c:a aac ` +
          `-strict experimental -shortest ${outputPath}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("Video Compilation Error:", stderr);
            reject(new Error("Failed to compile video"));
          } else resolve();
        }
      );
    });

    // Send result
    await conn.sendMessage(
      m.chat,
      {
        video: fs.readFileSync(outputPath),
        caption:
          "✅ Video enhancement complete!\n" +
          `⚙️ FPS: ${fps}\n` +
          `🕒 Processing time: ${((Date.now() - timestamp) / 1000).toFixed(
            1
          )}s`,
      },
      { quoted: m }
    );

    // Clean up
    fs.rmSync(workDir, { recursive: true, force: true });
    fs.rmSync(resultDir, { recursive: true, force: true });

    // Delete processing message
    await conn.sendMessage(m.chat, { delete: processingMsg.key });
  } catch (error) {
    console.error("HD Video Error:", error);
    m.reply(
      `⚠️ Error: ${error.message}\nPlease try again with a shorter video.`
    );
  }
};

handler.help = ["hdvid <fps> - Enhance video quality (max 30fps)"];
handler.tags = ["tools", "media"];
handler.command = /^(hdvid|enhance)$/i;
handler.limit = true;

module.exports = handler;
