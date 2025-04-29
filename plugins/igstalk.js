const cheerio = require("cheerio");
const axios = require("axios");

class InstagramStalker {
  constructor() {
    this.baseUrl = "https://greatfon.io/v/";
    this.timeout = 15000; // 15 seconds timeout
  }

  async getProfile(username) {
    try {
      const url = `${this.baseUrl}${encodeURIComponent(username)}`;
      const { data } = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://greatfon.io",
        },
      });

      const $ = cheerio.load(data);

      // Extract profile data with fallbacks
      const profile = {
        username: username,
        name: $("h1.text-4xl").text().trim() || "Not available",
        bio: $(".items-top .text-sm").text().trim() || "No bio available",
        posts:
          $('.stat-title:contains("Posts")')
            .siblings(".stat-value")
            .text()
            .trim() || "0",
        followers:
          $('.stat-title:contains("Followers")')
            .siblings(".stat-value")
            .text()
            .trim() || "0",
        following:
          $('.stat-title:contains("Following")')
            .siblings(".stat-value")
            .text()
            .trim() || "0",
        profilePic:
          $("figure img").attr("src") || "https://i.imgur.com/8nLFCVP.png", // Default placeholder
      };

      if (profile.name === "Not available") {
        throw new Error("Profile not found or private");
      }

      return profile;
    } catch (error) {
      console.error("Stalk Error:", error);
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  }
}

const handler = async (m, { conn, args }) => {
  // Validate input
  if (!args[0]) {
    const example = `.igstalk username`;
    return m.reply(
      `Please enter an Instagram username!\nExample: *${example}*`
    );
  }

  const username = args[0].replace(/^@/, ""); // Remove @ if included
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return m.reply(
      "❌ Invalid username format\nOnly letters, numbers, dots and underscores are allowed"
    );
  }

  const stalker = new InstagramStalker();

  try {
    // Show loading message
    const waitMsg = await m.reply("🔍 Searching Instagram profile...");

    // Get profile data
    const profile = await stalker.getProfile(username);

    // Format caption
    const caption = `
📷 *Instagram Profile Info* 📷

👤 *Username*: ${profile.username}
📛 *Name*: ${profile.name}
📝 *Bio*: ${profile.bio}

📊 *Stats*:
🖼️ Posts: ${profile.posts}
👥 Followers: ${profile.followers}
🤝 Following: ${profile.following}
        `.trim();

    // Send profile picture with info
    await conn.sendMessage(
      m.chat,
      {
        image: { url: profile.profilePic },
        caption: caption,
        contextInfo: {
          externalAdReply: {
            title: `${profile.name}'s Instagram`,
            body: `@${profile.username}`,
            thumbnailUrl: profile.profilePic,
            sourceUrl: `https://instagram.com/${profile.username}`,
          },
        },
      },
      { quoted: m }
    );

    // Delete loading message
    await conn.sendMessage(m.chat, { delete: waitMsg.key });
  } catch (error) {
    console.error("Handler Error:", error);
    const errorMessage = error.message.includes("not found")
      ? `Profile @${username} not found or may be private`
      : "⚠️ Failed to fetch profile. Please try again later.";

    m.reply(errorMessage);
  }
};

// Command configuration
handler.help = ["igstalk <username> - Get Instagram profile info"];
handler.tags = ["social", "tools"];
handler.command = /^(igstalk|instastalk)$/i;
handler.limit = true;

module.exports = handler;
