const fetch = require("node-fetch");

var handler = async (m, { conn, text }) => {
  if (!text)
    throw `*Please enter the name of the student you want to search for!*`;
  conn.reply(m.chat, "Searching for the person... Please wait", m);
  let res = await fetch("https://api-frontend.kemdikbud.go.id/hit_mhs/" + text);
  if (!res.ok) throw "Not Found";
  let json = await res.json();
  let message = "";

  json.mahasiswa.forEach((data) => {
    let nama = data.text;
    let websiteLink = data["website-link"];
    let website = `https://pddikti.kemdikbud.go.id${websiteLink}`;
    message += `\nName = ${nama}\n\nData found on website = ${website}\n\n\n`;
  });

  conn.reply(m.chat, message, m);
};

handler.help = ["student"];
handler.tags = ["internet"];
handler.command = /^(student|mahasiswa)$/i;
handler.limit = true;

module.exports = handler;
