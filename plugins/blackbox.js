const fetch = require("node-fetch");
const { randomBytes, randomUUID } = require("crypto");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `Please enter a question!\n\n*Example:* ${
        usedPrefix + command
      } Who is the president of Nigeria?`
    );

  const api = "https://api.blackbox.ai/api/chat";
  const headers = {
    "User-Agent": "Postify/1.0.0",
    Accept: "*/*",
    Referer: "https://api.blackbox.ai",
    "Content-Type": "application/json",
    Origin: "https://api.blackbox.ai",
    DNT: "1",
    "Sec-GPC": "1",
    Connection: "keep-alive",
  };

  const formatChat = (chat) => chat.map(({ files, ...rest }) => rest);
  const generateRandomHex = (bytes) => randomBytes(bytes).toString("hex");
  const generateUUID = () => randomUUID();

  const modelSettings = {
    blackbox: {},
    "llama-3.1-405b": { mode: true, id: "llama-3.1-405b" },
    "llama-3.1-70b": { mode: true, id: "llama-3.1-70b" },
    "gemini-1.5-flash": { mode: true, id: "Gemini" },
  };

  const defaultModels = {
    "gpt-4o": "gpt-4o",
    "claude-3.5-sonnet": "claude-sonnet-3.5",
    "gemini-pro": "gemini-pro",
  };

  const extraOptions = {
    "gpt-4o": { maxTokens: 4096 },
    "claude-3.5-sonnet": { maxTokens: 8192 },
    "gemini-pro": { maxTokens: 8192 },
  };

  const buildConfig = (model) => ({
    trendingAgentMode: modelSettings[model] || {},
    userSelectedModel: defaultModels[model] || undefined,
    ...extraOptions[model],
  });

  const cleanResponse = (text) => text.replace(/\$\$(.*?)\$\$/g, "").trim();

  const BlackBox = {
    async generate(chat, options, { max_retries = 5 } = {}) {
      const randomId = generateRandomHex(16);
      const randomUserId = generateUUID();
      chat = formatChat(chat);

      const data = {
        messages: chat,
        id: randomId,
        userId: randomUserId,
        previewToken: null,
        codeModelMode: true,
        agentMode: {},
        ...buildConfig(options.model),
        isMicMode: false,
        isChromeExt: false,
        githubToken: null,
        webSearchMode: true,
        userSystemPrompt: null,
        mobileClient: false,
        maxTokens: 100000,
        playgroundTemperature: parseFloat(options.temperature) || 0.7,
        playgroundTopP: 0.9,
        validated: "69783381-2ce4-4dbd-ac78-35e9063feabc",
      };

      try {
        const response = await fetch(api, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(await response.text());

        let responseText = await response.text();
        let finalResponse = cleanResponse(responseText);

        if (finalResponse.includes("$~$")) {
          data.mode = "continue";
          if (!data.messages.some((msg) => msg.content === finalResponse)) {
            data.messages.push({ content: finalResponse, role: "assistant" });
          }
          const continuation = await fetch(api, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
          });
          finalResponse += cleanResponse(await continuation.text());
        }

        return finalResponse;
      } catch (error) {
        if (max_retries > 0) {
          console.error(error, "Retrying...");
          return this.generate(chat, options, { max_retries: max_retries - 1 });
        } else {
          throw error;
        }
      }
    },
  };

  let key = await conn.sendMessage(m.chat, { text: "⌛ Please wait..." });
  try {
    const chatMessages = [{ role: "user", content: text }];
    const options = { model: "blackbox", temperature: 0.7 };

    const responseMessage = await BlackBox.generate(chatMessages, options);

    await conn.sendMessage(m.chat, {
      text: responseMessage,
      edit: key.key,
    });
  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: `❌ Error: ${error.message}`,
      edit: key.key,
    });
  }
};

handler.help = ["blackbox <your question>"];
handler.tags = ["ai"];
handler.command = ["blackbox"];

module.exports = handler;
