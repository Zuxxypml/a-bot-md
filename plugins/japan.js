const handler = (m, { text, usedPrefix, command }) => {
  // Get input text from message or quoted message
  const input = text || m.quoted?.text || false;

  if (!input) {
    const example = "John";
    return m.reply(
      `✏️ *Japanese Name Generator*\n\n` +
        `Please enter a name to convert!\n\n` +
        `Example: *${usedPrefix}${command} ${example}*\n` +
        `Try: *${usedPrefix}${command} ${global.author || "your name"}*`
    );
  }

  // Japanese character mapping
  const japaneseMap = {
    a: "ka",
    b: "zu",
    c: "mi",
    d: "te",
    e: "ku",
    f: "lu",
    g: "ji",
    h: "ri",
    i: "ki",
    j: "zus",
    k: "me",
    l: "ta",
    m: "rin",
    n: "to",
    o: "mo",
    p: "no",
    q: "ke",
    r: "shi",
    s: "ari",
    t: "chi",
    u: "do",
    v: "ru",
    w: "mei",
    x: "na",
    y: "fu",
    z: "zi",
  };

  // Convert each character
  let japaneseName = input
    .toLowerCase()
    .split("")
    .map((char) => {
      // Handle non-alphabetic characters
      if (!/[a-z]/i.test(char)) return char;
      return japaneseMap[char] || char;
    })
    .join("");

  // Capitalize first letter
  japaneseName = japaneseName.charAt(0).toUpperCase() + japaneseName.slice(1);

  // Send result with formatted message
  m.reply(
    `🌸 *Japanese Name Generator* 🌸\n\n` +
      `Original: *${input}*\n` +
      `Japanese: *${japaneseName}*\n\n` +
      `Try another name with *${usedPrefix}${command} [name]*`
  );
};

handler.tags = ["fun", "language"];
handler.command = handler.help = ["japanesename", "japan"];
handler.example = `${usedPrefix}japanesename Alice`;

module.exports = handler;
