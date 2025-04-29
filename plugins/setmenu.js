let handler = async (m, { conn, command, text }) => {
  // Determine which part of the menu to set (before, header, body, footer, after), or the entire menu if empty
  let type = command.replace(/^set(menu|help|\?)/, "").toLowerCase();

  if (type === "") {
    // Setting the whole menu
    if (text) {
      conn.menu = text;
      conn.reply(m.chat, "✅ Menu successfully set.\n" + info, m);
    } else {
      conn.menu = {};
      conn.reply(m.chat, "✅ Menu has been reset to default.", m);
    }
  } else {
    // Ensure menu object exists
    conn.menu = typeof conn.menu === "object" ? conn.menu : {};
    if (text) {
      conn.menu[type] = text;
      conn.reply(m.chat, `✅ Menu "${type}" successfully set.\n` + info, m);
    } else {
      delete conn.menu[type];
      conn.reply(m.chat, `✅ Menu "${type}" has been reset to default.`, m);
    }
  }
};

handler.help = [
  "setmenu <text>",
  "setmenubefore <text>",
  "setmenuheader <text>",
  "setmenubody <text>",
  "setmenufooter <text>",
  "setmenuafter <text>",
];
handler.tags = ["owner"];
handler.command = /^set(menu|help|\?)(before|header|body|footer|after)?$/i;

handler.rowner = true; // only real owner
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;

handler.fail = null;

module.exports = handler;

const info = `
Universal Placeholders:
%%          = literal "%"
%p          = Prefix
%exp        = Experience points
%limit      = Limit
%name       = User's name
%weton      = Current Weton (Javanese calendar day)
%week       = Day of week
%date       = Date
%time       = Time
%uptime     = Bot uptime
%totalreg   = Total registered users
%npmname
%npmdesc
%version
%github

Header & Footer Sections:
%category   = Category name

Body Section:
%cmd        = Command
%islimit    = Shows if command uses limit
`.trim();
