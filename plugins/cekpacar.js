let handler = async (m, { conn, text }) => {
  function no(number) {
    return number.replace(/\s/g, "").replace(/([@+-])/g, "");
  }
  text = no(text);
  if (isNaN(text)) {
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    var number = text;
  }
  if (number.length > 15 || (number.length < 9 && number.length > 0))
    return conn.reply(m.chat, `*Tag the target!*`, m);
  if (!text && !m.quoted) {
    user = m.sender;
    orang = "You";
  } else if (text) {
    var user = number + "@s.whatsapp.net";
    orang = "The person you tagged";
  } else if (m.quoted.sender) {
    var user = m.quoted.sender;
    orang = "The person you tagged";
  } else if (m.mentionedJid) {
    var user = number + "@s.whatsapp.net";
    orang = "The person you tagged";
  }
  if (typeof global.db.data.users[user] == "undefined") {
    return m.reply(
      "🚩 *The person you tagged is not registered in the database.*"
    );
  }
  if (
    typeof global.db.data.users[global.db.data.users[user].pasangan] ==
      "undefined" &&
    global.db.data.users[user].pasangan != ""
  ) {
    return m.reply(
      "🚩 *The target's partner/crush is not registered in the database.*"
    );
  }
  if (global.db.data.users[user].pasangan == "") {
    conn.reply(
      m.chat,
      `*${orang} does not have a partner and is not pursuing anyone*\n\n*Type /tembak @user to pursue someone*`,
      m
    );
  } else if (
    global.db.data.users[global.db.data.users[user].pasangan].pasangan != user
  ) {
    conn.reply(
      m.chat,
      `*${orang} is being strung along by @${
        global.db.data.users[user].pasangan.split("@")[0]
      } because they haven\'t been accepted or have been rejected*\n\n*Type .ikhlasin to let go of them from your heart*`,
      m,
      {
        contextInfo: {
          mentionedJid: [global.db.data.users[user].pasangan],
        },
      }
    );
  } else {
    conn.reply(
      m.chat,
      `*${orang} is in a relationship with @${
        global.db.data.users[user].pasangan.split("@")[0]
      } 🥳🥳*`,
      m,
      {
        contextInfo: {
          mentionedJid: [global.db.data.users[user].pasangan],
        },
      }
    );
  }
};

handler.help = ["cekpacar"];
handler.tags = ["fun"];
handler.command = /^(cekpacar)$/i;
handler.limit = true;
handler.group = true;
handler.fail = null;

module.exports = handler;
