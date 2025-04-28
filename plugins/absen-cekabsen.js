let handler = async (m, { conn }) => {
  let id = m.chat;
  conn.absen = conn.absen || {};

  if (!(id in conn.absen)) {
    await conn.reply(
      m.chat,
      `There is no active attendance session!\nStart one with .startabsen`,
      m
    );
    throw false;
  }

  let d = new Date();
  let date = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let absen = conn.absen[id][1];
  let list = absen
    .map((v, i) => `├ ${i + 1}. ${db.data.users[v].name}`)
    .join("\n");

  let caption = `
${date}
${conn.absen[id][2]}

┌「 Attendance List 」
├ Total: ${absen.length}
${list}
└────
\n.absen .deleteabsen
`.trim();

  await conn.reply(m.chat, caption, m);
};

handler.help = ["checkattendance"];
handler.tags = ["attendance"];
handler.command = /^(checkattendance|cekabsen)$/i;

module.exports = handler;
