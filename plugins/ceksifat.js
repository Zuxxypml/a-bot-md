let handler = async (m, { conn, command, text }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender;
  let pp = "";
  let name = m.mentionedJid[0]
    ? await conn.getName(m.mentionedJid[0])
    : conn.user.name;
  if (!text) return conn.reply(m.chat, "Enter your name!", m);
  let nm = 100;

  const angka = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`];

  const sifat = [
    "Kind-hearted",
    "Arrogant",
    "Stingy",
    "Generous",
    "Humble",
    "Insecure",
    "Shy",
    "Cowardly",
    "Mischievous",
    "Crybaby",
  ];

  const suka = [
    "Diligent",
    "Lazy",
    "Helpful",
    "Gossipy",
    "Prankster",
    "Confusing",
    "Shopping",
    "Chatting with their partner",
    "Chatting on WhatsApp because single",
    "Sad",
    "Lonely",
    "Happy",
  ];

  const a = pickRandom(angka);
  const b = pickRandom(angka);
  const e = pickRandom(angka);
  const f = pickRandom(angka);
  const g = pickRandom(angka);
  const h = pickRandom(angka);
  const c = pickRandom(sifat);
  const d = pickRandom(suka);

  let cksft = `
        *CHARACTER OF ${text}* 🔖
        │
        ├─❏ Name: *${text}*
        ├─❏ Good Morals: *${a}%*
        ├─❏ Bad Morals: *${b}%*
        ├─❏ Personality: *${c}*
        ├─❏ Always: *${d}*
        ├─❏ Intelligence: *${e}%*
        ├─❏ Naughtiness: *${f}%*
        ├─❏ Courage: *${g}%*
        └─❏ Fearfulness: *${h}%*
    `;

  let hasil = [
    `You will become a wealthy person, with a harmonious family, ${b} children, ${d}, a vehicle, and a house`,
    `You will become a modest person, with a harmonious family, ${c}, ${a} children, a vehicle, and a house`,
    `You will become a poor person, with a simple family, ${a} children, no vehicle, and a rented house`,
    `You will become a modest person, with a divorced family, ${e} children, ${b} vehicles, and ${b} houses`,
    `You will become a modest person, with a simple family, ${b} children, ${b} vehicles, and ${a} houses`,
    `You will become a poor person, with a divorced family, ${b} children, ${a} vehicles, and ${a} houses`,
    `You will become a wealthy person, with a simple family, ${a} children, ${a} vehicles, and ${b} houses`,
    `You will become a modest person, with a harmonious family, ${a} children, ${c} vehicles, and ${a} houses`,
    `You will become a poor person, with no family (single), no children, no vehicle, and no house`,
    `You will become a modest person, with a simple family, ${d} children, ${a} vehicles, and ${b} houses`,
    `You will become a modest person, with a chaotic family, no children (miscarried), ${b} vehicles, and ${a} houses`,
    `You will become a very wealthy person, with a very harmonious family, ${e} children, ${f} vehicles, and ${g} houses`,
    `You will become a very poor person, with a simple family, ${g} children, no vehicle, and a rented house`,
    `You will become a wealthy person, with a stingy family, ${b} children, ${b} vehicles, and ${b} houses`,
    `You will become a modest person, with a stingy family, ${a} children, ${a} vehicles, and ${a} houses`,
    `You will become a modest person, with a divorced family, ${b} children, ${a} vehicles, and a rented house`,
    `You will become a very modest person, with a peaceful family, ${a} children, ${a} vehicles, and ${a} houses`,
    `You will become a modest person, with a very simple family, ${a}${a} children, ${a} vehicles, and ${a} houses`,
    `You will become a modest person, with a very simple family, ${b} twin children, ${c} vehicles, and ${b} houses`,
    `You will become a modest person, with a simple family, ${b} twin children and ${a} more children, ${a} vehicles, and ${a} houses`,
  ];

  let msdpn = pickRandom(hasil);

  if (command == "ceksifat") {
    await conn.reply(m.chat, cksft, m);
  } else if (command == "masadepannya") {
    await conn.reply(m.chat, msdpn, m);
  }
};

handler.help = ["ceksifat (nama)", "masadepannya (nama)"];
handler.tags = ["fun"];
handler.command = ["ceksifat", "masadepannya"];

module.exports = handler;

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}
