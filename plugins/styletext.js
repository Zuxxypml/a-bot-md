const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `Type ${usedPrefix}style <text>`;
  const styled = await stylizeText(
    text || (m.quoted && m.quoted.text) || m.text
  );
  const reply = Object.entries(styled)
    .map(([name, value]) => `*${name}*\n${value}`)
    .join("\n\n");
  conn.reply(m.chat, reply, m);
};

handler.help = ["style <text>"];
handler.tags = ["maker"];
handler.command = /^(style)$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.exp = 0;

module.exports = handler;

async function stylizeText(text) {
  const res = await fetch(
    `http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text)}`
  );
  const html = await res.text();
  const dom = new JSDOM(html);
  const rows = dom.window.document.querySelectorAll("table tr");
  const obj = {};
  for (let tr of rows) {
    const name = tr.querySelector(".aname").textContent;
    const content = tr.cells[1].textContent.trim();
    obj[name + (obj[name] ? " Reversed" : "")] = content;
  }
  return obj;
}
