let handler = async (m, { conn, text }) => {
  if (!text) throw "Please tag someone and provide a message!";

  let cm = copy(m);
  let who;

  if (text.includes("@0")) {
    who = "0@s.whatsapp.net";
  } else if (m.isGroup) {
    who = cm.participant = m.mentionedJid[0];
  } else {
    who = m.chat;
  }

  if (!who) throw "You need to tag someone!";

  cm.key.fromMe = false;
  cm.message[m.mtype] = copy(m.msg);

  let sp = "@" + who.split("@")[0];
  let [fakeSenderText, ...realMessageArray] = text.split(sp);

  conn.fakeReply(
    m.chat,
    realMessageArray.join(sp).trimStart(),
    who,
    fakeSenderText.trimEnd(),
    m.isGroup ? m.chat : false,
    {
      contextInfo: {
        mentionedJid: conn.parseMention(realMessageArray.join(sp).trim()),
      },
    }
  );
};

handler.help = ["fakereply @user <message>"];
handler.tags = ["fun"];
handler.command = /^fakereply$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;

module.exports = handler;

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
