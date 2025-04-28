let handler = (m, { text, usedPrefix, command }) => {
  let morse = text || (m.quoted && m.quoted.text) || false;
  if (!morse)
    throw `_Please enter Morse code!_\n\nExample:\n${
      usedPrefix + command
    } •– / –••• / –•–• / –•• / •`;

  // Morse Code Dictionary (Morse to Text)
  const morseDict = {
    "•–": "a",
    "–•••": "b",
    "–•–•": "c",
    "–••": "d",
    "•": "e",
    "••–•": "f",
    "––•": "g",
    "••••": "h",
    "••": "i",
    "•–––": "j",
    "–•–": "k",
    "•–••": "l",
    "––": "m",
    "–•": "n",
    "–––": "o",
    "•––•": "p",
    "––•–": "q",
    "•–•": "r",
    "•••": "s",
    "–": "t",
    "••–": "u",
    "•••–": "v",
    "•––": "w",
    "–••–": "x",
    "–•––": "y",
    "––••": "z",
    "•––––": "1",
    "••–––": "2",
    "•••––": "3",
    "••••–": "4",
    "•••••": "5",
    "–••••": "6",
    "––•••": "7",
    "–––••": "8",
    "––––•": "9",
    "–––––": "0",
    "/": " ",
  };

  // Split Morse code based on spaces or slashes
  let morseWords = morse.trim().split(/\s+/);

  // Convert each Morse character to Text
  let textResult = morseWords.map((char) => morseDict[char] || "?").join("");

  m.reply(`Converted Text:\n\n${textResult}`);
};

handler.tags = ["fun", "tools"];
handler.command = handler.help = ["dmorse", "demorse"];
module.exports = handler;
