let handler = (m) => m;

handler.before = function (m) {
  let user = global.db.data.users[m.sender];

  // If the user was AFK
  if (user.afk > -1) {
    m.reply(
      `
You have stopped being AFK${user.afkReason ? " after " + user.afkReason : ""}
You were away for: ${this.msToDate(new Date() - user.afk)}
`.trim()
    );
    user.afk = -1;
    user.afkReason = "";
  }

  // Check if anyone mentioned is AFK
  let jids = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  for (let jid of jids) {
    let mentionedUser = global.db.data.users[jid];
    if (!mentionedUser) continue;
    let afkTime = mentionedUser.afk;
    if (!afkTime || afkTime < 0) continue;
    let reason = mentionedUser.afkReason || "AFK";
    let teks = `
_@${jid.split("@")[0]} is currently AFK_

Reason: ${reason}
Away for: ${this.msToDate(new Date() - afkTime)}
`.trim();
    m.reply(teks, m.chat);
  }
  return true;
};

module.exports = handler;
