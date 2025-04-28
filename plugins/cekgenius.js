/*
* [ GENIUS CHECK FEATURE ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*/

const { createCanvas } = require('canvas');

const handler = async (m, { text, conn }) => {
  let target = m.mentionedJid && m.mentionedJid[0];
  if (!target) return m.reply(`*Example:* .cekgenius @user`);
  
  let name = global.db.data.users[target]?.name || 'Unnamed Genius';

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function wrapText(text, maxLength) {
    const words = text.split(' ');
    let lines = [], currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length < maxLength) {
        currentLine += word + ' ';
      } else {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      }
    });

    if (currentLine.length > 0) lines.push(currentLine.trim());
    return lines;
  }

  function getDescriptionByLevel(level) {
    if (level <= 5) return 'Just starting to develop.';
    if (level <= 15) return 'Your potential is visible.';
    if (level <= 25) return 'Your thinking is sharp.';
    if (level <= 35) return 'Your intelligence is growing rapidly.';
    if (level <= 45) return 'Becoming more wise.';
    if (level <= 55) return 'Nearly at the top, innovative.';
    if (level <= 65) return 'Outstanding thinker.';
    if (level <= 75) return 'Able to solve complex problems.';
    if (level <= 85) return 'Approaching perfection.';
    if (level <= 95) return 'Almost perfect.';
    if (level === 100) return 'True genius!';
    return 'No description available.';
  }

  const geniusLevels = [
    'Genius Level: 4%',
    'Genius Level: 7%',
    'Genius Level: 12%',
    'Genius Level: 22%',
    'Genius Level: 27%',
    'Genius Level: 35%',
    'Genius Level: 41%',
    'Genius Level: 48%',
    'Genius Level: 56%',
    'Genius Level: 64%',
    'Genius Level: 71%',
    'Genius Level: 77%',
    'Genius Level: 83%',
    'Genius Level: 90%',
    'Genius Level: 95%',
    'Genius Level: 100%'
  ];

  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const canvas = createCanvas(637, 400);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  ['#1E90FF', '#4682B4', '#5F9EA0', '#00BFFF', '#87CEEB'].forEach((color, index, arr) => {
    gradient.addColorStop(index / (arr.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Poppins", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 6;
  ctx.fillText('GENIUS CHECK RESULT', canvas.width / 2, 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px "Lora", serif';
  ctx.fillText(name, canvas.width / 2, 120);

  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(50, 180, 537, 20);

  const randomGenius = pickRandom(geniusLevels);
  const levelMatch = randomGenius.match(/Genius Level: (\d+)%/);

  if (!levelMatch) return m.reply('⚠️ Error detecting genius level!');

  const level = parseInt(levelMatch[1]);
  const progressWidth = (537 * level) / 100;

  const progressGradient = ctx.createLinearGradient(50, 180, 587, 180);
  progressGradient.addColorStop(0, '#1E90FF');
  progressGradient.addColorStop(1, '#87CEEB');
  ctx.fillStyle = progressGradient;
  ctx.fillRect(50, 180, progressWidth, 20);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Open Sans", sans-serif';
  ctx.fillText(`${level}%`, 170, 195);

  const description = getDescriptionByLevel(level);
  const lines = wrapText(description, 80);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px "Poppins", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#FF4500';
  ctx.lineWidth = 4;

  let textY = 230;
  lines.forEach((line, i) => {
    const lineY = textY + (i * 25);
    ctx.strokeText(line, canvas.width / 2, lineY);
    ctx.fillText(line, canvas.width / 2, lineY);
  });

  const buffer = canvas.toBuffer();
  await conn.sendFile(m.chat, buffer, 'genius.png', 'Here is your Genius Check result!', m);
};

handler.command = ['cekgenius'];
handler.tags = ['fun', 'tools'];
handler.help = ['cekgenius @user'];

module.exports = handler;
