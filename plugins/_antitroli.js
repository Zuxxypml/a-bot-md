let handler = (m) => m;

handler.all = async function (m) {
  if (
    m.message &&
    m.isBaileys &&
    m.quoted &&
    m.quoted.mtype === "orderMessage" &&
    !(m.quoted.token && m.quoted.orderId)
  ) {
    m.reply("Trolley Bug Detected!\n\n" + require("util").format(m.key));

    // Clear the chat to remove the buggy message
    await this.modifyChat(m.chat, "clear", {
      includeStarred: false,
    }).catch(console.log);

    // Notify the owner about the attacker
    this.reply(
      global.owner[0] + "@s.whatsapp.net",
      `
Trolley spammer detected: @${m.sender.split`@`[0]}
ID: ${m.isGroup ? m.chat : m.sender}
Name: ${m.isGroup ? this.getName(m.chat) : this.getName(m.sender)}
`.trim(),
      null,
      { contextInfo: { mentionedJid: [m.sender] } }
    );
  }
};

module.exports = handler;
