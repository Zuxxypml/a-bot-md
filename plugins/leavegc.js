const handler = async (m, { conn, args, command, isOwner }) => {
  if (!isOwner)
    return m.reply("❌ This command is only available for the bot owner");

  const delay = (time) => new Promise((res) => setTimeout(res, time));
  const groups = conn.chats
    .all()
    .filter((v) => v.jid.endsWith("g.us") && !v.read_only);

  const leaveMessages = [
    "Goodbye everyone! 👋",
    "Bot signing off! 🚀",
    "It's been great! 😊",
    "Time for me to go! 🏃‍♂️",
    "Bot out! ✌️",
    "See you all later! 👀",
    "My work here is done! ✅",
  ];

  const getRandomMessage = () =>
    leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

  try {
    if (command.endsWith("all") || command.endsWith("semua")) {
      await m.reply(
        `🚀 Initiating mass group exit from ${groups.length} groups...`
      );

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const message = `${getRandomMessage()}\n\n- Your Bot`;

        await conn.sendMessage(group.jid, { text: message });
        await conn.groupLeave(group.jid);

        if (i < groups.length - 1) await delay(2000); // 2 second delay between leaves
      }

      await m.reply(`✅ Successfully left ${groups.length} groups`);
    } else if (args[0]) {
      const targetGroup = groups.find((g) => g.jid === args[0]);
      if (!targetGroup) throw "❌ Bot is not in that group";

      await conn.sendMessage(args[0], {
        text: `${getRandomMessage()}\n\n- Your Bot`,
      });
      await conn.groupLeave(args[0]);
      await m.reply(`✅ Successfully left the group`);
    } else {
      if (!m.isGroup) return m.reply("❌ This command only works in groups");

      await conn.sendMessage(m.chat, {
        text: `${getRandomMessage()}\n\n- Your Bot`,
      });
      await conn.groupLeave(m.chat);
    }
  } catch (error) {
    console.error("Leave error:", error);
    await m.reply(`❌ Failed to leave: ${error.message || error}`);
  }
};

handler.help = [
  "leavegc - Leave current group",
  "leavegc [jid] - Leave specific group",
  "leavegcall - Leave all groups",
];
handler.tags = ["owner"];
handler.command = /^leaveg(c|ro?up)(all|semua)?$/i;
handler.owner = true;

module.exports = handler;
