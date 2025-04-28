const { createCanvas, registerFont } = require("canvas");
const Jimp = require("jimp");
const WSF = require("wa-sticker-formatter");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Usage: ${usedPrefix + command} <text>`);

  try {
    registerFont("./src/font/arialnarrow.ttf", { family: "ArialNarrow" });

    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const findOptimalFontSize = (text, maxWidth, maxHeight) => {
      let fontSize = 100;
      ctx.font = `bold ${fontSize}px ArialNarrow`;
      const words = text.split(" ");
      let lines = [];

      while (fontSize > 0) {
        lines = [];
        let currentLine = [];
        let currentWidth = 0;
        ctx.font = `bold ${fontSize}px ArialNarrow`;

        for (const word of words) {
          const wordWidth = ctx.measureText(word + " ").width;
          if (currentWidth + wordWidth <= maxWidth) {
            currentLine.push(word);
            currentWidth += wordWidth;
          } else {
            if (currentLine.length > 0) lines.push(currentLine);
            currentLine = [word];
            currentWidth = wordWidth;
          }
        }

        if (currentLine.length > 0) lines.push(currentLine);

        const totalHeight = lines.length * (fontSize + 10);
        if (totalHeight <= maxHeight) break;

        fontSize -= 2;
      }
      return { fontSize, lines };
    };

    let padding = 40;
    let maxWidth = canvas.width - padding * 2;
    let maxHeight = canvas.height - padding * 2;
    let { fontSize, lines } = findOptimalFontSize(text, maxWidth, maxHeight);

    ctx.fillStyle = "#000000";
    ctx.font = `bold ${fontSize}px ArialNarrow`;

    let lineHeight = fontSize + 10;
    let totalHeight = lines.length * lineHeight;
    let startY = (canvas.height - totalHeight) / 2 + fontSize / 2;

    lines.forEach((line, i) => {
      if (line.length === 1) {
        ctx.textAlign = "left";
        ctx.fillText(line.join(" "), padding, startY + i * lineHeight);
      } else {
        let totalSpacing =
          maxWidth -
          line.reduce((acc, word) => acc + ctx.measureText(word).width, 0);
        let spaceBetween =
          line.length > 1 ? totalSpacing / (line.length - 1) : 0;

        let currentX = padding;
        line.forEach((word) => {
          ctx.fillText(word, currentX, startY + i * lineHeight);
          currentX += ctx.measureText(word).width + spaceBetween;
        });
      }
    });

    let buffer = canvas.toBuffer();
    let image = await Jimp.read(buffer);
    image.blur(2);

    let processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Create sticker using WSF
    const wsf = new WSF.Sticker(processedBuffer, {
      pack: global.packname,
      author: global.author,
      type: "full",
    });

    await wsf.build();
    const stickerBuffer = await wsf.get();

    if (stickerBuffer) {
      await conn.sendMessage(
        m.chat,
        { sticker: stickerBuffer },
        {
          quoted: m,
          mimetype: "image/webp",
          ephemeralExpiration: 86400,
        }
      );
    }
  } catch (e) {
    console.error(e);
    await m.reply(`An error occurred while creating the sticker: ${e.message}`);
  }
};

handler.help = ["brat"];
handler.tags = ["fun", "sticker"];
handler.command = /^brat$/i;
handler.limit = true;

module.exports = handler;
