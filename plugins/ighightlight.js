const fetch = require("node-fetch");

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Validate username input
  if (!args[0]) {
    const example = `${usedPrefix + command} username`;
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

  try {
    // Show loading indicator
    const loadingMsg = await m.reply(
      "🔍 Searching for Instagram highlights..."
    );

    // Fetch highlights
    const apiUrl = `${global.API(
      "lolhuman",
      `/api/highlights/${username}`,
      "apikey"
    )}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();

    if (!json.result || json.result.length === 0) {
      throw "No highlights found for this account";
    }

    // Send each highlight with progress
    let successCount = 0;
    const total = json.result.length;

    for (let i = 0; i < total; i++) {
      try {
        const link = json.result[i];
        const isVideo = link.includes("mp4");

        await conn.sendMessage(
          m.chat,
          {
            [isVideo ? "video" : "image"]: { url: link },
            caption:
              `📌 *Instagram Highlights*\n\n` +
              `👤 *Username*: ${username}\n` +
              `📊 *Progress*: ${i + 1}/${total}`,
            ...(isVideo && { gifPlayback: false }),
          },
          { quoted: m }
        );
        successCount++;
      } catch (mediaError) {
        console.error(`Error sending highlight ${i + 1}:`, mediaError);
        await m.reply(`⚠️ Failed to send highlight ${i + 1}`);
      }
    }

    // Send completion message
    await conn.sendMessage(
      m.chat,
      {
        text:
          `✅ Successfully sent ${successCount}/${total} highlights\n` +
          `From: @${username}`,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      },
      { quoted: m }
    );

    // Delete loading message
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
  } catch (error) {
    console.error("Highlight Error:", error);

    let errorMessage = "⚠️ Failed to get highlights\n";
    if (error.message.includes("No highlights")) {
      errorMessage = "No highlights found for this account";
    } else if (error.message.includes("API request")) {
      errorMessage += "Server error. Please try again later.";
    } else {
      errorMessage += error.message;
    }

    await m.reply(errorMessage);
  }
};

// Command configuration
handler.help = [
  "ighighlight <username> - Download Instagram highlights",
  "igsorotan <username> - Unduh sorotan Instagram",
];
handler.tags = ["downloader", "instagram"];
handler.command = /^(ighighlights?|igsorotan)$/i;
handler.limit = true;
handler.private = true;

module.exports = handler;
