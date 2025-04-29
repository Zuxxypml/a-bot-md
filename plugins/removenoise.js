const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");

const NoiseRemover = {
  async run(buffer) {
    // Generate encrypted timestamp payload for API authentication
    const timestamp = Math.floor(Date.now() / 1000);
    const { amtext, slam_ltol, iavmol } = JSON.parse(encryptData(timestamp));

    // Build multipart form data
    const form = new FormData();
    form.append("media", buffer, {
      filename: crypto.randomBytes(3).toString("hex") + "_input.mp3",
      contentType: "audio/mpeg",
    });
    form.append("fingerprint", crypto.randomBytes(16).toString("hex"));
    form.append("mode", "pulse");
    form.append("amtext", amtext);
    form.append("iavmol", iavmol);
    form.append("slam_ltol", slam_ltol);

    // Send request to noise removal endpoint
    const response = await axios.post(
      "https://noiseremoval.net/wp-content/plugins/audioenhancer/requests/noiseremoval/noiseremovallimited.php",
      form,
      { headers: form.getHeaders() }
    );
    return response.data;
  },
};

/**
 * Encrypts data using AES-256-CBC with a random salt and IV
 */
function encryptData(text, password = "cryptoJS") {
  const salt = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 999, 32, "sha512");
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text.toString(), "utf8", "base64");
  encrypted += cipher.final("base64");
  return JSON.stringify({
    amtext: encrypted,
    slam_ltol: salt.toString("hex"),
    iavmol: iv.toString("hex"),
  });
}

let handler = async (m, { conn }) => {
  try {
    // Identify quoted or original message
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";

    // Validate media type
    if (!/audio|video/.test(mime)) {
      return m.reply(
        "❗ Please send or reply to an audio/video file to remove noise."
      );
    }

    // Notify user that processing has started
    await m.reply("⏳ Processing audio, please wait...");

    // Download media buffer
    const media = await q.download();
    const result = await NoiseRemover.run(media);

    // Handle API errors
    if (result.error) {
      return m.reply(`❌ Noise removal failed: ${result.message}`);
    }

    // Extract URLs and status info
    const { enhanced, original } = result.media;
    const infoMessage = `
✅ *Noise Removal Successful*

*⭐ Audio Info*
- Original: ${original.uri}
- Enhanced: ${enhanced.uri}

*📊 Status*
- Status: ${result.flag}
- Message: ${result.message}
- Worker: ${result.worker}
    `.trim();

    // Send enhanced audio back as a voice note
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: enhanced.uri },
        mimetype: "audio/mp4",
        fileName: "enhanced-audio.mp3",
        ptt: true,
      },
      { quoted: m }
    );

    // Send informational summary
    await m.reply(infoMessage);
  } catch (error) {
    console.error(error);
    m.reply("❌ An error occurred while processing the audio.");
  }
};

handler.help = ["removenoise"];
handler.tags = ["audio"];
handler.command = ["removenoise", "cleanaudio", "noiseless"];

module.exports = handler;
