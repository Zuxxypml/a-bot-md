const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const tmpDir = path.join(__dirname, "../tmp/");

/**
 * Creates a short video where the input image slides upward over a colored background.
 * @param {Buffer} imgBuffer - The input image buffer.
 * @param {number} duration - Duration of the video in seconds (default 10).
 * @param {number} fps - Frames per second (default 60).
 * @returns {Promise<Buffer>} - Promise that resolves with the output MP4 buffer.
 */
function createSlidingVideo(imgBuffer, duration = 10, fps = 60) {
  return new Promise((resolve, reject) => {
    // Build FFmpeg filter graph layers
    const layers = [
      `color=s=512x512:d=${duration}:r=${fps}[bg]`, // Background layer
      "[0:v]scale=-2:512[img]", // Scale the input image to height 512
      `[bg][img]overlay=x='(w+h)*((n/${fps})*-1/${duration})+h'`, // Slide the image upward
    ].join(";");

    // Prepare temporary file paths
    const filename = `${Date.now()}_run`;
    const inputPath = path.join(tmpDir, filename + ".jpg");
    const outputPath = path.join(tmpDir, filename + ".mp4");

    // Save the image buffer as a JPEG
    fs.writeFileSync(inputPath, imgBuffer);

    // FFmpeg arguments
    const args = [
      "-y", // Overwrite output files without asking
      "-i",
      inputPath, // Input file
      "-t",
      duration.toString(),
      "-filter_complex",
      layers,
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "18",
      outputPath,
    ];

    // Spawn FFmpeg process
    spawn("ffmpeg", args, { stdio: "ignore" })
      .on("error", reject)
      .on("close", () => {
        try {
          // Read the output video buffer
          const videoBuffer = fs.readFileSync(outputPath);
          // Clean up temp files
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          resolve(videoBuffer);
        } catch (e) {
          reject(e);
        }
      });
  });
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Determine the target message (quoted image or the message itself)
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || "";

  // Validate input image
  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    throw `❗ Please send or reply to a JPEG/PNG image with the caption:\n\n${usedPrefix}${command}`;
  }

  // Notify user
  await m.reply("⏳ Processing your image, please wait...");

  // Download image buffer
  const imgBuffer = await q.download();

  try {
    // Create the sliding video
    const videoBuffer = await createSlidingVideo(imgBuffer);

    // Send the resulting video
    await conn.sendFile(
      m.chat,
      videoBuffer,
      "sliding.mp4",
      "✅ Here’s your sliding video!",
      m
    );
  } catch (e) {
    console.error(e);
    m.reply("⚠️ An error occurred while creating the video.");
  }
};

handler.help = ["run (reply to image)"];
handler.tags = ["maker"];
handler.command = /^run$/i;
handler.limit = true;

module.exports = handler;
