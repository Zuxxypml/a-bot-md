let handler = async (m, { conn }) => {
  let users = m.mentionedJid[0];
  if (!users) {
    conn.reply(m.chat, `Tag the user you want to target!`, m);
    return;
  }

  let name = global.db.data.users[users]?.name || "User";
  let user = global.db.data.users[m.sender];
  let id = m.sender;
  let kerja = "forced-sex";
  conn.mission = conn.mission ? conn.mission : {};

  if (id in conn.mission) {
    conn.reply(m.chat, `Complete the Mission ${conn.mission[id][0]} first!`, m);
    throw false;
  }

  let randomMoney = Math.floor(Math.random() * 1000000);
  let randomExp = Math.floor(Math.random() * 10000);

  let dimas = `
👙 You forced
     them to take off their clothes 😋
`.trim();

  let dimas2 = `
🥵💦 sszz Ahhhh.....
`.trim();

  let dimas3 = `
🥵Ahhhh, It hurts!! >////<
 💦Crotttt.....
  💦Crottt again
`.trim();

  let dimas4 = `
🥵💦💦Ahhhhhh😫
`.trim();

  let result = `
*—[ Forced Sex Result with ${name} ]—*
➕ 💹 Money = [ ${randomMoney} ]
➕ ✨ Exp = [ ${randomExp} ]
`.trim();

  user.exp += randomExp;

  conn.mission[id] = [
    kerja,
    setTimeout(() => {
      delete conn.mission[id];
    }, 27000),
  ];

  setTimeout(() => {
    m.reply(result);
  }, 27000);

  setTimeout(() => {
    m.reply(dimas4);
  }, 25000);

  setTimeout(() => {
    m.reply(dimas3);
  }, 20000);

  setTimeout(() => {
    m.reply(dimas2);
  }, 15000);

  setTimeout(() => {
    m.reply(dimas);
  }, 10000);

  setTimeout(() => {
    m.reply("😋starting forced sex..");
  }, 0);

  user.lastMission = new Date() * 1;
};

handler.help = ["forced-sex @tag"];
handler.tags = ["premium", "fun"];
handler.command = /^(forced-sex)$/i;
handler.group = true;

module.exports = handler;
