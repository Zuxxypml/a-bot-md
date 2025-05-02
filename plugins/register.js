const REGEX = /(.*)[.|]([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix }) {
  let user = global.db.data.users[m.sender];

  // Already registered?
  if (user.registered) {
    return conn.reply(
      m.chat,
      `📛 You are already registered.\n\nUse *${usedPrefix}daftarulang* to re-register.`,
      m
    );
  }

  // Validate format
  if (!REGEX.test(text)) {
    throw `❗ Invalid format!\nExample: *${usedPrefix}daftar John|18*`;
  }

  // Extract and clean inputs
  let [, nameRaw, ageRaw] = text.match(REGEX);
  const name = nameRaw?.trim();
  const age = Number(ageRaw);

  if (!name) throw "❌ Name cannot be empty!";
  if (!ageRaw || isNaN(age)) throw "❌ Age must be a valid number!";
  if (name.length > 40) throw "❌ Name is too long (max 40 characters).";
  if (age > 40) throw "🔞 You must be 40 years old or younger to register.";
  if (age < 9) throw "🚫 You must be at least 9 years old to use this bot.";

  // Register the user
  user.name = name;
  user.age = age;
  user.regTime = Date.now();
  user.registered = true;

  // Send welcome voice note (if available)
  await conn.sendFile(
    m.chat,
    "./src/vn/arigatou.opus",
    "welcome.opus",
    null,
    m,
    true
  );

  // Confirm registration
  m.reply(
    `✅ *Registration Complete!*
╔═「 👤 Profile Info 」
┣ 📛 Name: ${user.name}
┣ 🎂 Age: ${user.age} years
╚═════════════════`
  );
};

handler.help = ["daftar <name|age>", "register <name|age>"];
handler.tags = ["main"];
handler.command = /^(daftar|register)$/i;

module.exports = handler;
