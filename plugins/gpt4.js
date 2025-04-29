const axios = require("axios");
const { delay } = require("@adiwajshing/baileys");

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  // Validate input
  if (!text) {
    const example = `${usedPrefix}${command} explain quantum computing`;
    return m.reply(`Please enter your question!\nExample: *${example}*`);
  }

  const isSearchMode = args[0]?.toLowerCase() === "search";
  const query = isSearchMode ? args.slice(1).join(" ") : text;

  if (isSearchMode && !args[1]) {
    return m.reply('Please enter your search query after "search"');
  }

  try {
    // Show loading message
    const loadingMsg = await m.reply(
      isSearchMode
        ? "🔍 Searching the web..."
        : "🤖 Processing your question..."
    );

    // API configuration
    const apiUrl = "https://www.blackbox.ai/api/chat";
    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      Origin: "https://www.blackbox.ai",
      Referer: "https://www.blackbox.ai/",
    };

    const requestData = {
      messages: [{ role: "user", content: query }],
      webSearchModePrompt: isSearchMode,
      userSelectedModel: "gpt-4",
      validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
      maxTokens: 1024,
    };

    // Make API request
    const response = await axios.post(apiUrl, requestData, { headers });
    let result = response.data;

    // Process response
    if (typeof result === "object") {
      result = JSON.stringify(result, null, 2);
    }

    // Truncate very long responses
    const MAX_LENGTH = 15000;
    if (result.length > MAX_LENGTH) {
      await m.reply(
        `⚠️ Response is too long (${result.length} characters), showing first part:`
      );
      result = result.substring(0, MAX_LENGTH) + "\n... [TRUNCATED]";
    }

    // Send response
    await conn.sendMessage(
      m.chat,
      {
        text: result,
        contextInfo: {
          externalAdReply: {
            title: isSearchMode ? "Web Search Results" : "AI Response",
            body: query.length > 30 ? query.substring(0, 30) + "..." : query,
            thumbnailUrl: "https://www.blackbox.ai/favicon.ico",
            sourceUrl: "https://www.blackbox.ai/",
          },
        },
      },
      { quoted: m }
    );

    // Delete loading message
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
  } catch (error) {
    console.error("AI Handler Error:", error);

    let errorMessage = "⚠️ An error occurred";
    if (error.response) {
      if (error.response.status === 429) {
        errorMessage += ": Too many requests. Please try again later.";
      } else {
        errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
      }
    } else {
      errorMessage += `: ${error.message}`;
    }

    m.reply(errorMessage);
  }
};

// Command configuration
handler.help = [
  "ai <question> - Get AI response",
  "ai search <query> - Search the web",
];
handler.tags = ["ai", "tools"];
handler.command = /^(ai|bb|blackbox)$/i;
handler.limit = true;

module.exports = handler;
