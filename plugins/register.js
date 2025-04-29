const REGEX = /(.*)[.|]([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix }) {
  let user = global.db.data.users[m.sender];

  // Check if already registered
  if (user.registered) {
    return conn.reply(
      m.chat,
      `You are already registered.\n\nType ${usedPrefix}daftarulang to re-register.`,
      m
    );
  }

  // Validate format: name|age
  if (!REGEX.test(text)) {
    throw `Invalid format!\nExample: *${usedPrefix}daftar John|18*`;
  }

  // Extract name and age
  let [, name, age] = text.match(REGEX);
  if (!name) throw "Name cannot be empty!";
  if (!age) throw "Age cannot be empty!";
  if (name.length > 40) throw "Name is too long!";
  if (parseInt(age) > 40)
    throw "You must be 40 years old or younger to register.";
  if (parseInt(age) < 9)
    throw "You must be at least 9 years old to use this bot!";

  // Register the user
  user.name = name.trim();
  user.age = parseInt(age);
  user.regTime = Date.now();
  user.registered = true;

  // Send welcome voice note
  await conn.sendFile(
    m.chat,
    "./src/vn/arigatou.opus",
    "welcome.opus",
    null,
    m,
    true
  );

  // Confirmation message
  m.reply(
    `
✅ Registration successful!
╔═「 Profile Info 」
┣⊱ Name: ${user.name}
┣⊱ Age: ${user.age} years
╚════════════════
`.trim()
  );
};

handler.help = ["daftar <name|age>", "register <name|age>"];
handler.tags = ["main"];
handler.command = /^(daftar|register)$/i;

module.exports = handler;
