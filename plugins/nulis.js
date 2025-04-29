const { format } = require("util");
const { spawn } = require("child_process");

let fontPath = "src/font/Zahraaa.ttf";

let handler = async (m, { conn, args }) => {
  // Disable if no image processing support
  if (!global.support.convert && !global.support.magick && !global.support.gm) {
    return (handler.disabled = true);
  }

  let inputPath = "src/kertas/magernulis1.jpg"; // background image (notebook page)
  let d = new Date();
  let date = d.toLocaleDateString("id-ID");
  let day = d.toLocaleDateString("id-ID", { weekday: "long" });
  let text = args.join(" "); // the text to write

  if (!text)
    throw "Please provide some text to write.\n\nExample: .nulis I love coding!";

  let bufs = [];

  // Prepare spawn command using either gm or magick
  const [_spawnprocess, ..._spawnargs] = [
    ...(global.support.gm ? ["gm"] : global.support.magick ? ["magick"] : []),
    "convert",
    inputPath,
    "-font",
    fontPath,
    "-size",
    "1024x784",
    "-pointsize",
    "20",
    "-interline-spacing",
    "1",
    "-annotate",
    "+806+78",
    day,
    "-font",
    fontPath,
    "-pointsize",
    "18",
    "-annotate",
    "+806+102",
    date,
    "-font",
    fontPath,
    "-pointsize",
    "20",
    "-interline-spacing",
    "-7.5",
    "-annotate",
    "+344+142",
    text,
    "jpg:-",
  ];

  // Execute image manipulation
  spawn(_spawnprocess, _spawnargs)
    .on("error", (e) => m.reply(format(e))) // reply on error
    .on("close", () => {
      conn.sendFile(
        m.chat,
        Buffer.concat(bufs),
        "writing.jpg",
        "Careful not to get caught writing 😅",
        m
      );
    })
    .stdout.on("data", (chunk) => bufs.push(chunk));
};

handler.help = ["nulis <text>"];
handler.tags = ["tools"];
handler.command = /^nulis$/i;

module.exports = handler;
