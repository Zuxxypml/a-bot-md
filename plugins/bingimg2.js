let { BingImageClient } = require("../lib/bingimage.js");

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let text;

  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    throw `Please input some text or reply to a message!\n\nExample:\n${usedPrefix}${command} One Piece pirate ship art`;
  }

  await m.reply("_Processing your request, please wait..._");

  try {
    const res = new BingImageClient({
      cookie:
        "1sfTMLE7SIGaVvH4IFq0EhSvl-tfoKDXbvwV2ZqaU1yZWJ8rJredf04RtZtjPSimcVy0yn1s5IMHM4NZoi30ghgww5ZbZliweetOpq72DLjio514r1tNNkAq8z-g87zHtCXXZqr_jd0jcXPFK7KfyDCsBHkEKQjXZiQUm1RVTA3Jal4QdMo6aoPbD_wklbKw8X2Tbe9LQHEHHGgBUor_Asg",
      // Please add your valid Bing cookie here!
    });

    const data = await res.createImage(text);

    const filteredData = data.filter((file) => !file.endsWith(".svg"));
    const totalCount = filteredData.length;

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {
        try {
          await conn.sendFile(
            m.chat,
            filteredData[i],
            "",
            `*Image (${i + 1}/${totalCount})*`,
            m,
            false,
            {
              mentions: [m.sender],
            }
          );
        } catch (error) {
          console.error(`Error sending file: ${error.message}`);
          await m.reply(`Failed to send image *(${i + 1}/${totalCount})*`);
        }
      }
    } else {
      await m.reply("No images found after filtering.");
    }
  } catch (error) {
    console.error(`Error in handler: ${error.message}`);
    await m.reply("An error occurred while processing your request.");
  }
};

handler.help = ["bingimg2 <query>"];
handler.tags = ["ai"];
handler.command = /^(bingimg2)$/i;

module.exports = handler;
