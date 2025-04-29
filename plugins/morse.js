let handler = (m, { text, usedPrefix, command }) => {
  let inputText = text || (m.quoted && m.quoted.text) || false;
  if (!inputText)
    throw (
      "_Enter some text!_\n\nExample:\n" +
      usedPrefix +
      command +
      " " +
      global.author
    );

  // Dictionary for conversion (characters to Morse code)
  const morseDict = {
    a: "•–",
    b: "–•••",
    c: "–•–•",
    d: "–••",
    e: "•",
    f: "••–•",
    g: "––•",
    h: "••••",
    i: "••",
    j: "•–––",
    k: "–•–",
    l: "•–••",
    m: "––",
    n: "–•",
    o: "–––",
    p: "•––•",
    q: "––•–",
    r: "•–•",
    s: "•••",
    t: "–",
    u: "••–",
    v: "•••–",
    w: "•––",
    x: "–••–",
    y: "–•––",
    z: "––••",
    1: "•––––",
    2: "••–––",
    3: "•••––",
    4: "••••–",
    5: "•••••",
    6: "–••••",
    7: "––•••",
    8: "–––••",
    9: "––––•",
    0: "–––––",
    " ": "/",
  };

  // Convert each character to Morse
  let morse = inputText
    .toLowerCase()
    .split("")
    .map((char) => {
      return morseDict[char] || char; // Keep characters not found in the dictionary
    })
    .join(" ");

  m.reply(`Morse code:\n\n${morse}`);
};

handler.tags = ["fun", "tools"];
handler.command = handler.help = ["morse"];
module.exports = handler;
