const { igstory } = require("../lib/scrape");

const handler = async (m, { conn, args, isPrems }) => {
  // Validate username input
  if (!args[0]) {
    const example = `.igstory username`;
    return m.reply(
      `Please enter an Instagram username!\nExample: *${example}*`
    );
  }

  const username = args[0].replace(/^@/, ""); // Remove @ if included
  const usernameRegex =
    /^[a-zA-Z0-9_](?:(?:[a-zA-Z0-9_]|(?:\.(?!\.))){0,28}(?:[a-zA-Z0-9_]))?$/;

  if (!usernameRegex.test(username)) {
    return m.reply(
      "❌ Invalid username format\nOnly letters, numbers, dots and underscores are allowed (max 30 chars)"
    );
  }

  try {
    // Show processing message
    const waitMsg = await m.reply("⏳ Fetching Instagram stories...");

    // Get stories
    const stories = await igstory(username);

    if (!stories || stories.length === 0) {
      throw "No stories found or account is private";
    }

    // Send stories with progress
    let successCount = 0;
    const totalStories = stories.length;

    for (let i = 0; i < totalStories; i++) {
      try {
        const story = stories[i];
        const isImage = story.downloadUrl.includes(".jpg");
        const timestamp = Date.now();
        const ext = isImage ? ".jpg" : ".mp4";
        const filename = `${username}-${timestamp}-${i}${ext}`;

        await conn.sendMessage(
          m.chat,
          {
            [isImage ? "image" : "video"]: { url: story.downloadUrl },
            caption:
              `📌 *Instagram Story*\n\n` +
              `👤 @${username}\n` +
              `📊 ${i + 1}/${totalStories}`,
            fileName: filename,
            ...(!isImage && { gifPlayback: false }),
          },
          { quoted: m }
        );
        successCount++;

        // Apply limit for non-premium users
        if (!isPrems && i >= 2) break; // Limit free users to 3 stories
      } catch (error) {
        console.error(`Error sending story ${i + 1}:`, error);
        await m.reply(`⚠️ Failed to send story ${i + 1}`);
      }
    }

    // Send completion message
    await conn.sendMessage(
      m.chat,
      {
        text:
          `✅ Successfully sent ${successCount} stories\n` +
          `From: @${username}`,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      },
      { quoted: m }
    );

    // Delete loading message
    await conn.sendMessage(m.chat, { delete: waitMsg.key });

    // Apply limit for non-premium users
    if (!isPrems) {
      await conn.sendMessage(
        m.chat,
        {
          text: "💡 Want more stories? Upgrade to premium for unlimited downloads!",
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error("Story Error:", error);
    const errorMessage =
      error.message?.includes("not found") || typeof error === "string"
        ? error
        : "⚠️ Failed to fetch stories. The account may be private or have no stories.";

    await m.reply(errorMessage);
  }
};

// Command configuration
handler.help = ["igstory <username> - Download Instagram stories"];
handler.tags = ["downloader", "instagram"];
handler.command = /^(igstory|igs)$/i;
handler.limit = true;
handler.private = false;

module.exports = handler;
