const {
  useMultiFileAuthState,
  DisconnectReason,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const path = require("path");
const P = require("pino");

let handler = async (m, { conn, usedPrefix, command }) => {
  if (conn.user.jid !== global.conn.user.jid) {
    return m.reply("⚠️ This command can only be used by the main bot account");
  }

  try {
    // Setup authentication
    const authDir = path.join(__dirname, "../sessions", m.sender.split("@")[0]);
    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    // Connection options
    const connectionOptions = {
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: state.keys,
      },
      logger: P({ level: "silent" }),
      browser: ["Elaina-MD", "Safari", "3.0"],
      getMessage: async () => ({}),
    };

    // Create new connection
    const jadibot = makeWASocket(connectionOptions);

    // Connection update handler
    jadibot.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        if (
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut
        ) {
          console.log("Reconnecting...");
          setTimeout(() => handler(m, { conn }), 5000);
        } else {
          console.log("Connection closed");
        }
      } else if (connection === "open") {
        m.reply(
          `✅ *Bot Clone Activated!*\n\n• Number: ${
            jadibot.user.id.split("@")[0]
          }\n• Prefix: ${usedPrefix}\n\nType *${usedPrefix}menu* to see commands`
        );
      }
    });

    // Save credentials when updated
    jadibot.ev.on("creds.update", saveCreds);

    // Generate pairing code if not registered
    if (!jadibot.authState.creds.registered) {
      const phoneNumber = m.sender.split("@")[0];
      const code = await jadibot.requestPairingCode(phoneNumber);
      const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

      m.reply(
        `📱 *Pairing Code:* ${formattedCode}\n\n` +
          "To connect:\n" +
          "1. Open WhatsApp > Settings > Linked Devices\n" +
          '2. Tap "Link a Device"\n' +
          "3. Enter this code"
      );
    }

    // Store the connection
    global.conns = global.conns || [];
    global.conns.push(jadibot);
  } catch (error) {
    console.error("Jadibot error:", error);
    m.reply("❌ Failed to create bot clone. Please try again later.");
  }
};

handler.help = ["jadibot"];
handler.tags = ["owner"];
handler.command = /^(jadibot|clonebot)$/i;
handler.owner = true;

module.exports = handler;
