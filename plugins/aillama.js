const fetch = require("node-fetch");

let messages = [];

const handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    if (!text) return m.reply(`Please enter your question.`);

    let response = await fetch(
      `https://restapii.rioooxdzz.web.id/api/llama?message=${encodeURIComponent(
        text
      )}`
    );

    if (!response.ok) {
      throw new Error("Request to Llama API failed.");
    }

    let result = await response.json();

    await conn.sendMessage(m.chat, {
      text: "" + result.data.response,
    });

    messages = [...messages, { role: "user", content: text }];
  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: "Error: " + error.message,
    });
  }
};

handler.help = ["llama <question>"];
handler.tags = ["ai"];
handler.command = /^(ilama)$/i;
handler.register = true;

module.exports = handler;
