const fetch = require("node-fetch");
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} = require("@adiwajshing/baileys");

const handler = async (m, { conn, usedPrefix, command, text }) => {
  // Validate input
  if (!text)
    throw `Please enter a GitHub username!\nExample: *${usedPrefix}${command} adiwajshing*`;

  const username = text.trim();

  try {
    // Show loading indicator
    const loadingMsg = await m.reply("🔍 Searching GitHub profile...");

    // Fetch GitHub data
    const githubData = await getGithubData(username);
    if (!githubData) {
      await conn.sendMessage(m.chat, {
        delete: loadingMsg.key,
      });
      return m.reply(
        "❌ GitHub user not found. Please check the username and try again."
      );
    }

    // Format profile information
    const profileInfo = `
🌟 *GitHub Profile Information* 🌟

👤 *Username:* ${githubData.login}
📛 *Name:* ${githubData.name || "Not specified"}
📝 *Bio:* ${githubData.bio || "No bio available"}
📍 *Location:* ${githubData.location || "Not specified"}
📊 *Public Repos:* ${githubData.public_repos}
👥 *Followers:* ${githubData.followers}
🤝 *Following:* ${githubData.following}
🔗 *Profile URL:* https://github.com/${githubData.login}
🔄 *Last Updated:* ${new Date(githubData.updated_at).toLocaleDateString()}
    `.trim();

    // Get profile image
    const profileImageUrl = githubData.avatar_url;

    // Interactive button version
    if (command === "githubstalkb") {
      const interactiveMsg = {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: profileInfo },
              footer: { text: "GitHub Profile Viewer • Powered by Baileys" },
              header: await prepareWAMessageMedia(
                { image: { url: profileImageUrl } },
                { upload: conn.waUploadToServer }
              ),
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: `Visit ${githubData.login}'s Profile`,
                      url: `https://github.com/${githubData.login}`,
                    }),
                  },
                ],
              },
            },
          },
        },
      };

      const msg = generateWAMessageFromContent(m.chat, interactiveMsg, {
        quoted: m,
      });
      await conn.relayMessage(m.chat, msg.message, {});
    }
    // Regular version
    else {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: profileImageUrl },
          caption: profileInfo,
          contextInfo: {
            externalAdReply: {
              title: `${githubData.login}'s GitHub Profile`,
              body: githubData.bio || "Check out my GitHub profile",
              thumbnailUrl: profileImageUrl,
              sourceUrl: `https://github.com/${githubData.login}`,
            },
          },
        },
        { quoted: m }
      );
    }

    // Delete loading message
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
  } catch (error) {
    console.error("GitHub Stalk Error:", error);
    m.reply(
      "⚠️ An error occurred while fetching GitHub data. Please try again later."
    );
  }
};

// Improved GitHub API fetch function
async function getGithubData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "GitHub-Profile-Viewer-Bot",
      },
    });

    // Handle rate limits and errors
    if (response.status === 404) return null;
    if (response.status === 403) {
      const resetTime = new Date(
        response.headers.get("x-ratelimit-reset") * 1000
      );
      throw new Error(
        `GitHub API rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`
      );
    }
    if (!response.ok)
      throw new Error(`GitHub API error: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
}

// Command configuration
handler.help = [
  "githubstalk <username> - Get GitHub profile info",
  "githubstalkb <username> - Get interactive GitHub profile",
];
handler.tags = ["internet", "tools"];
handler.command = /^(githubstalkb?|ghstalkb?)$/i;
handler.limit = true;

module.exports = handler;
