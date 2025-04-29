const fetch = require("node-fetch");

let handler = async (m, { conn }) => {
  // Fetch a random quote from the API
  let res = await fetch(
    global.API("lolhuman", "/api/random/quotes", "", "apikey")
  );
  if (!res.ok) throw "❌ Server error. Please notify the owner.";

  let json = await res.json();
  let quoteText = json.result.quote;
  let author = json.result.by;

  // Format and send the quote
  let message = `💬 *Quote:*\n${quoteText}\n\n— *${author}*`;
  conn.reply(m.chat, message, m);
};

handler.help = ["quote"];
handler.tags = ["quotes"];
handler.command = /^quote(s)?$/i;
handler.limit = true;

module.exports = handler;
