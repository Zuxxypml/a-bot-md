const axios = require("axios");

/**
 * Captures a full-page screenshot of the given URL as a PNG buffer.
 * Uses the thum.io service under the hood.
 * @param {string} url - The target webpage URL
 * @returns {Promise<{ status: number, type: string, buffer: Buffer }>} Screenshot result
 */
async function Screenshot(url) {
  try {
    const response = await axios.get(
      `https://image.thum.io/get/png/fullpage/viewportWidth/2400/${url}`,
      {
        responseType: "arraybuffer",
      }
    );

    return {
      status: 200,
      type: "image/png",
      buffer: response.data,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Handler for the .ssweb command.
 * Takes a URL as argument, validates it, and returns a screenshot image.
 */
let handler = async (m, { args, conn }) => {
  const targetUrl = args[0];

  // Validate input URL
  if (!targetUrl) {
    return conn.reply(
      m.chat,
      "Please provide a URL to capture.Example: .ssweb https://www.nasa.gov",
      m
    );
  }

  // Block any disallowed domains
  if (/aduh\.com|hore\.com|poi\.care/i.test(targetUrl)) {
    return conn.reply(m.chat, "That domain is not allowed.", m);
  }

  // Acknowledge processing
  await m.reply("_Loading screenshot..._");

  try {
    const screenshot = await Screenshot(targetUrl);
    await conn.sendMessage(m.chat, { image: screenshot.buffer }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Failed to capture screenshot.");
  }
};

handler.help = ["ssweb"];
handler.tags = ["tools"];
handler.command = /^(ssweb)$/i;

module.exports = handler;
