let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.math = conn.math || {};
  let id = m.sender;

  if (id in conn.math) {
    clearTimeout(conn.math[id][3]);
    delete conn.math[id];
    return m.reply("Hmmm... trying to cheat, huh? 😏");
  }
  // Above anti-cheat code isn't really necessary, just a little protection against cheating.

  if (!text)
    return m.reply(
      `Usage: ${usedPrefix + command} <calculation>\n\nExample:\n${
        usedPrefix + command
      } 5÷0.5`
    );

  let val = text
    .replace(/[^0-9\-\/+*×÷πEe().]/g, "") // Allow only numbers and math symbols
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π|pi/gi, "Math.PI")
    .replace(/e/gi, "Math.E")
    .replace(/\/+/g, "/")
    .replace(/\++/g, "+")
    .replace(/-+/g, "-");

  let format = val
    .replace(/Math\.PI/g, "π")
    .replace(/Math\.E/g, "e")
    .replace(/\//g, "÷")
    .replace(/\*/g, "×");

  try {
    let result = Function('"use strict"; return (' + val + ")")();

    if (result === Infinity || result === -Infinity || isNaN(result)) {
      throw new Error("Invalid calculation!");
    }

    m.reply(`*${format}* = _${result}_`);
  } catch (e) {
    m.reply(
      "_Invalid format or unsupported calculation!_\nOnly numbers and symbols -, +, *, /, ×, ÷, π, e, (.) are supported."
    );
  }
};

handler.help = ["calc", "calculator"];
handler.tags = ["tools"];
handler.command = /^(calc(ulate|ulator)?|calculator?)$/i;
handler.exp = 5;

module.exports = handler;
