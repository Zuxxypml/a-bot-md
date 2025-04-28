const fetch = require("node-fetch");

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text)
    throw m.reply(
      `Please enter the question!\n\nExample:\n${usedPrefix}${command} 5 multiplied by 5`
    );

  try {
    let response = await fetch(`https://mfarels.my.id/api/brainly?q=${text}`);
    let data = await response.json();
    m.reply(data.result);
  } catch (e) {
    try {
      let fallback = await fetch(`https://mfarels.my.id/api/brainly?q=${text}`);
      let fallbackData = await fallback.json();
      m.reply(fallbackData.data.data);
    } catch (e) {
      m.reply("❌ Error: Server is down or unreachable!");
    }
  }
};

handler.help = ["brainly <question>"];
handler.tags = ["education"];
handler.command = /^brainly$/i;

module.exports = handler;
