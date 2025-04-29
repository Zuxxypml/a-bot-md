/*
 • Feature by Anomaki Team
 • Created by: Nazand Code
 • Purpose: Fetch the content of a Pastebin link (for lazy folks 😎)
 • Built out of boredom at night
 • Don't remove the watermark/credit
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const fetch = require("node-fetch");

const handler = async (m, { args }) => {
  const link = args[0]?.trim();

  if (!link) {
    return m.reply("Please provide a Pastebin URL!");
  }

  if (!/^https:\/\/pastebin\.com\/[a-zA-Z0-9]+$/.test(link)) {
    return m.reply("Invalid Pastebin URL!");
  }

  const pasteId = link.split("/").pop();

  try {
    const response = await fetch(`https://pastebin.com/raw/${pasteId}`);
    if (!response.ok) throw new Error("Failed to fetch Pastebin content.");

    const content = await response.text();

    if (!content) {
      return m.reply("No content found in that Pastebin!");
    }

    m.reply(`${content}`);
  } catch (error) {
    console.error(error);
    m.reply("An error occurred while fetching data from Pastebin.");
  }
};

handler.command = ["getpb", "pastebin", "getpastebin"];
handler.tags = ["tools"];
handler.help = ["getpb <pastebin-url>"];

module.exports = handler;
