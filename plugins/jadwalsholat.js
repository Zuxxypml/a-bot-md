const axios = require("axios");
const cheerio = require("cheerio");

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Default to Lagos if no city specified
  const city = args[0]?.toLowerCase() || "lagos";

  try {
    await m.reply("⏳ Fetching prayer times for Nigeria...");

    // Nigerian cities mapping
    const nigerianCities = {
      lagos: "Lagos",
      abuja: "Abuja",
      kano: "Kano",
      ibadan: "Ibadan",
      "port-harcourt": "Port Harcourt",
      kano: "Kano",
      kaduna: "Kaduna",
    };

    const cityName =
      nigerianCities[city] || city.charAt(0).toUpperCase() + city.slice(1);

    // Fetch data from Islamic prayer time API for Nigeria
    const { data } = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=Nigeria&method=2`,
      {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    const timings = data.data.timings;
    const dateInfo = data.data.date.readable;
    const hijriDate = data.data.date.hijri.date;

    // Format message in Nigerian English style
    const message = `
🕌 *Prayer Times in ${cityName.toUpperCase()}* 🕌
📅 ${dateInfo} | ${hijriDate}

🕒 *Prayer Schedule:*
• Fajr: ${timings.Fajr}
• Sunrise: ${timings.Sunrise}
• Dhuhr: ${timings.Dhuhr}
• Asr: ${timings.Asr}
• Maghrib: ${timings.Maghrib}
• Isha: ${timings.Isha}

ℹ️ Usage: ${usedPrefix}prayertime <city>
Example: ${usedPrefix}prayertime abuja
`.trim();

    await conn.reply(m.chat, message, m, {
      contextInfo: {
        externalAdReply: {
          title: `Islamic Prayer Times for ${cityName.toUpperCase()}`,
          body: "Powered by AlAdhan API",
          thumbnailUrl: "https://i.ibb.co/4sYZ8Gc/islamic.png",
        },
      },
    });
  } catch (error) {
    console.error("Error:", error);
    let errorMessage = "Failed to get prayer times. ";

    if (error.response?.status === 404) {
      errorMessage += `City '${city}' not found in Nigeria.`;
    } else if (error.code === "ECONNABORTED") {
      errorMessage += "Request timeout, please try again.";
    } else {
      errorMessage += "Please check the city name or try again later.";
    }

    await conn.reply(m.chat, errorMessage, m);
  }
};

handler.help = ["prayertime <city>"];
handler.tags = ["islamic", "tools"];
handler.command = /^(prayertime|prayertimes|salat)$/i;
handler.example = `${usedPrefix}prayertime lagos`;

module.exports = handler;
