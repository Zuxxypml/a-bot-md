const handler = {
  async main(m, { conn, usedPrefix }) {
    // Send introduction message with button
    await conn.sendMessage(m.chat, {
      text:
        `🌟 *Welcome to WhatsApp Bot* 🌟\n\n` +
        `I'm an automated assistant designed to help you with various tasks.\n` +
        `Let's get started by registering your information!`,
      footer: `Tap the button below to begin`,
      buttons: [
        {
          buttonId: `${usedPrefix}register`,
          buttonText: { displayText: "Start Registration" },
          type: 1,
        },
      ],
      headerType: 1,
    });

    // Initialize user session
    if (!this.sessions) this.sessions = {};
    this.sessions[m.sender] = { step: 0 };
  },

  async handleRegistration(m) {
    if (!this.sessions?.[m.sender]) return;

    const session = this.sessions[m.sender];
    const { text, quoted } = m;
    const userData = global.db.data.users[m.sender] || {};

    try {
      // Step 1: Start registration
      if ((/register|start/i.test(text) || session.step === 0) && !quoted) {
        session.step = 1;
        session.chat = await m.reply(
          "📝 *Registration* 📝\n\n" +
            "Please reply with your full name:\n" +
            "Example: *John Doe*"
        );
        return;
      }

      // Step 2: Handle name input
      if (session.step === 1 && quoted?.id === session.chat?.id) {
        if (!text || text.length < 2) {
          await m.reply("Name too short. Minimum 2 characters required.");
          return;
        }

        userData.name = text.trim();
        session.step = 2;
        session.chat = await m.reply(
          "How old are you? (Numbers only)\n" + "Example: *25*"
        );
        return;
      }

      // Step 3: Handle age input
      if (session.step === 2 && quoted?.id === session.chat?.id) {
        const age = parseInt(text);
        if (isNaN(age)) {
          await m.reply("Please enter a valid number for age.");
          return;
        }

        if (age < 13 || age > 120) {
          await m.reply("Age must be between 13-120 years.");
          return;
        }

        userData.age = age;
        userData.regDate = new Date().toISOString();

        await m.reply(
          "✅ *Registration Complete!* ✅\n\n" +
            `Name: ${userData.name}\n` +
            `Age: ${age}\n\n` +
            "You can now use all bot features!"
        );

        // Save to database and clean up
        global.db.data.users[m.sender] = userData;
        delete this.sessions[m.sender];
      }
    } catch (error) {
      console.error("Registration error:", error);
      await m.reply("An error occurred. Please try again later.");
      delete this.sessions[m.sender];
    }
  },
};

// Command handler
handler.exec = async function (m, { conn, usedPrefix }) {
  if (!m.sender.endsWith(".net")) return;

  if (m.text.match(/^(help|register|start)$/i)) {
    return handler.main(m, { conn, usedPrefix });
  }

  return handler.handleRegistration(m);
};

handler.command = /^(help|register|start)$/i;
handler.tags = ["main"];
handler.help = [
  "help - Show bot information",
  "register - Start user registration",
];

module.exports = handler;
