let handler = async (m, { conn, args, usedPrefix }) => {
  conn.math = conn.math ? conn.math : {};

  // Show available modes if no argument provided
  if (args.length < 1)
    throw `
Available modes: ${Object.keys(modes).join(" | ")}
Usage example: ${usedPrefix}math epic
`.trim();

  let mode = args[0].toLowerCase();
  // Validate mode
  if (!(mode in modes))
    throw `
Available modes: ${Object.keys(modes).join(" | ")}
Usage example: ${usedPrefix}math epic
`.trim();

  let id = m.sender;
  // Check if user already has an active question
  if (id in conn.math)
    return conn.reply(
      m.chat,
      "You still have an unanswered question in this chat",
      conn.math[id][0]
    );

  // Generate math question
  let math = genMath(mode);
  conn.math[id] = [
    await conn.reply(
      m.chat,
      `What is the result of *${math.str}*?\n\nTimeout: ${(
        math.time / 1000
      ).toFixed(2)} seconds\nCorrect answer bonus: ${
        math.bonus
      } XP\n_Only you can answer this_`,
      m
    ),
    math,
    3, // Number of attempts
    setTimeout(() => {
      if (conn.math[id])
        conn.reply(
          m.chat,
          `Time's up!\nThe answer was ${math.result}`,
          conn.math[id][0]
        );
      delete conn.math[id];
    }, math.time),
  ];
};

handler.help = ["math [mode]"];
handler.tags = ["game"];
handler.command = /^math$/i;
handler.group = true;

module.exports = handler;

// Difficulty modes configuration
let modes = {
  beginner: [-3, 3, -3, 3, "+-", 15000, 10],
  medium: [-10, 10, -10, 10, "*/+-", 20000, 40],
  hard: [-40, 40, -20, 20, "*/", 40000, 150],
  expert: [-100, 100, -70, 70, "*/", 30000, 350],
  insane: [-999999, 999999, -999999, 999999, "*/", 40000, 666],
  impossible: [
    -99999999999,
    99999999999,
    -99999999999,
    999999999999,
    "*/",
    60000,
    888,
  ],
  godlike: [-999999999999999, 999999999999999, -999, 999, "/", 90000, 999],
};

// Operator symbols for display
let operators = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
};

function genMath(mode) {
  let [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
  let a = randomInt(a1, a2);
  let b = randomInt(b1, b2);
  let op = pickRandom([...ops]);

  // Calculate result (using * for division to avoid floating point issues)
  let result = new Function(
    `return ${a} ${op.replace("/", "*")} ${b < 0 ? `(${b})` : b}`
  )();

  // For division questions, make sure we're dividing evenly
  if (op == "/") [a, result] = [result, a];

  return {
    str: `${a} ${operators[op]} ${b}`,
    mode,
    time,
    bonus,
    result,
  };
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from];
  from = Math.floor(from);
  to = Math.floor(to);
  return Math.floor((to - from) * Math.random() + from);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
