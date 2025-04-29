const axios = require("axios");
const cheerio = require("cheerio");
const sharp = require("sharp");

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0";

async function getDistanceInfo(from, to) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      `distance from ${from} to ${to}`
    )}&hl=en`;
    const { data: html } = await axios.get(searchUrl, {
      headers: { "User-Agent": userAgent },
    });

    const $ = cheerio.load(html);
    const result = {};

    // Extract map image
    const imgData = html.split("var s='")?.[1]?.split("'")?.[0];
    result.image = /^data:.*?\/.*?;base64,/i.test(imgData)
      ? Buffer.from(imgData.split(",")[1], "base64")
      : null;

    // Extract distance and duration info
    result.info = [];
    $("div.BbbuR.uc9Qxb.uE1RRc").each((_, element) => {
      const text = $(element).text().trim();
      if (text) result.info.push(text);
    });

    // Generate Google Maps URL
    result.mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(
      from
    )}/${encodeURIComponent(to)}/`;

    return result;
  } catch (error) {
    console.error("Distance Check Error:", error);
    throw new Error("Failed to fetch distance information");
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Validate input
  const [from, to] = text.split("|").map((s) => s.trim());
  if (!from || !to) {
    return m.reply(
      `Please specify both locations!\nExample: *${
        usedPrefix + command
      } Jakarta|Bandung*`
    );
  }

  // Check if locations are the same
  if (from.toLowerCase() === to.toLowerCase()) {
    return m.reply(
      "Are you trying to measure distance between the same place? 😅"
    );
  }

  try {
    // Send wait message
    const waitMsg = await m.reply("🗺️ Calculating distance... Please wait...");

    // Get distance info
    const { image, info, mapsUrl } = await getDistanceInfo(from, to);

    // Prepare response
    if (info.length === 0) {
      await conn.sendMessage(m.chat, {
        delete: waitMsg.key,
      });
      return m.reply("Couldn't find distance information for these locations.");
    }

    const caption =
      `🚗 *Distance Information*\n\n` +
      `${info.join("\n")}\n\n` +
      `📍 Google Maps: ${mapsUrl}`;

    // Send response with image if available
    if (image) {
      const optimizedImage = await sharp(image)
        .resize(800, 600, { fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();

      await conn.sendMessage(
        m.chat,
        {
          image: optimizedImage,
          caption: caption,
          contextInfo: {
            externalAdReply: {
              title: `${from} to ${to}`,
              body: "Distance Calculator",
              thumbnail: optimizedImage,
              sourceUrl: mapsUrl,
            },
          },
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
    }

    // Delete wait message
    await conn.sendMessage(m.chat, { delete: waitMsg.key });
  } catch (error) {
    console.error("Handler Error:", error);
    m.reply("⚠️ Failed to get distance information. Please try again later.");
  }
};

handler.help = ["distance <from>|<to> - Get distance between locations"];
handler.tags = ["tools", "maps"];
handler.command = /^(distance|gmaps|jarak)$/i;

module.exports = handler;
