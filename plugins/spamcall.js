const fetch = require("node-fetch");

let handler = async (m, { conn, text, usedPrefix }) => {
  // Ensure the user provided a phone number
  if (!text) {
    throw `Example usage:\n${usedPrefix}spamcall 628xxxxxxxx`;
  }

  // Strip non-digits and remove the country code prefix "62"
  let number = text.replace(/[^0-9]/g, "").slice(2);

  // Validate that the remaining number starts with "8"
  if (!number.startsWith("8")) {
    throw `Example usage:\n${usedPrefix}spamcall 628xxxxxxxx`;
  }

  // Inform the user that the request is being processed
  await m.reply("_Please wait, your request is being processed..._");

  // Call the verification endpoint to trigger the spam call
  let response = await fetch(
    `https://id.jagreward.com/member/verify-mobile/${number}`
  ).then((res) => res.json());

  // Build a user-friendly reply
  let botNumber = response.phone_prefix;
  let resultMsg =
    `*Bot Number:* _${botNumber}_\n\n` +
    `_The bot has successfully called you!_`;

  // Send the result back to the chat
  await conn.reply(m.chat, resultMsg.trim(), m);

  // (Optional) If you want to inspect the raw JSON, you could uncomment:
  // await m.reply(JSON.stringify(response, null, 2));
};

handler.help = ["spamcall <number>"];
handler.tags = ["tools", "premium"];
handler.command = /^spamcall$/i;
handler.premium = true;

module.exports = handler;
