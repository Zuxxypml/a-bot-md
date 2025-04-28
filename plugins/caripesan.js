let handler = async (m, { conn, text }) => {
  if (!text) throw "Please enter the message you want to search for!";

  let split = text.split`|`;
  let result = await conn.searchMessages(split[0], m.chat, split[1], 1);

  if (result.messages.length > 0) {
    let total = result.messages.length;
    let sp =
      total < Number(split[1])
        ? `Only found ${total} message(s)`
        : `Found ${total} message(s)`;
    m.reply(sp);

    result.messages.map(async ({ key }) => {
      let { remoteJid: _remoteJid, id: _ids } = key;
      let _message = await conn.loadMessage(_remoteJid, _ids);
      conn.reply(m.chat, "Here's the message:", _message);
    });
  } else {
    m.reply("No messages found.");
  }
};

handler.help = ["findmessage <message>|<amount>"];
handler.tags = ["tools"];
handler.limit = 1;
handler.command = /^findmessage$/i;

module.exports = handler;
