const fetch = require("node-fetch");
const util = require("util");

let handler = async (m, { text, conn }) => {
  if (!text) throw "Please provide a URL to fetch!";

  let res = await fetch(text);

  if (!/text|json/.test(res.headers.get("content-type"))) {
    // If not text or JSON, send the file
    return conn.sendFile(
      m.chat,
      text,
      "file",
      `Here is your file:\n${text}`,
      m
    );
  }

  let content = await res.buffer();

  try {
    content = util.format(JSON.parse(content + ""));
  } catch (e) {
    content = content + "";
  } finally {
    m.reply(content.slice(0, 65536));
  }
};

handler.help = ["fetch <url>"];
handler.tags = ["downloader", "tools"];
handler.command = /^fetch$/i;

module.exports = handler;
