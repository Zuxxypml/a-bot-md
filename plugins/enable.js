let handler = async (
  m,
  { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner, isMods }
) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command);
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let setting = global.db.data.settings[conn.user.jid];
  let type = (args[0] || "").toLowerCase();
  let isAll = false;
  let isUser = false;

  switch (type) {
    case "welcome":
    case "detect":
    case "delete":
    case "antidelete":
    case "autodelvn":
    case "stiker":
    case "game":
    case "antilink":
    case "viewonce":
    case "autoviewonce":
      if (!m.isGroup || !(isAdmin || isOwner)) {
        global.dfail("admin", m, conn);
        throw false;
      }
      chat[
        type.replace("autoviewonce", "viewonce").replace("antidelete", "delete")
      ] = isEnable;
      if (type === "antidelete") chat.delete = !isEnable;
      break;

    case "document":
      isUser = true;
      user.useDocument = isEnable;
      break;

    case "autolevelup":
    case "levelup":
      isUser = true;
      user.autolevelup = isEnable;
      break;

    case "public":
      isAll = true;
      if (!isROwner) {
        global.dfail("rowner", m, conn);
        throw false;
      }
      global.opts["self"] = !isEnable;
      break;

    case "restrict":
      isAll = true;
      if (!isOwner) {
        global.dfail("owner", m, conn);
        throw false;
      }
      setting.restrict = isEnable;
      break;

    case "grouponly":
    case "backup":
    case "backupsc":
    case "anticall":
    case "antitag":
    case "autoread":
    case "autoreact":
    case "respon":
    case "anon":
    case "anonymous":
      isAll = true;
      if (!isOwner) {
        global.dfail("owner", m, conn);
        throw false;
      }
      setting[type.replace("anon", "anonymous")] = isEnable;
      break;

    case "mycontact":
    case "mycontacts":
    case "whitelistcontact":
    case "whitelistcontacts":
    case "whitelistmycontact":
    case "whitelistmycontacts":
      if (!isOwner) {
        global.dfail("owner", m, conn);
        throw false;
      }
      conn.callWhitelistMode = isEnable;
      break;

    default:
      if (!/[01]/.test(command))
        throw `
╔═══ 〘 Available Options 〙
${
  m.isGroup && isAdmin
    ? `
║ *Group Admin Options*
╟ welcome
╟ delete
╟ antilink
╟ detect
╟ viewonce
`
    : ""
}
║ *User Options*
╟ autolevelup
╟ document (Send mp3/mp4 as document)
${
  isOwner
    ? `
║ *Owner Options*
╟ antitag
╟ anticall
╟ grouponly
╟ backup
╟ backupsc
╟ public
╟ whitelistmycontacts
╟ autodelvn
╟ restrict
╟ autoread
╟ autoreact
╟ anonymous
`
    : ""
}
╚══════════════
Example Usage:
${usedPrefix}on welcome
${usedPrefix}off welcome
`.trim();
      throw false;
  }

  m.reply(
    `✅ *${type}* has been successfully *${
      isEnable ? "enabled" : "disabled"
    }* ${isAll ? "globally" : isUser ? "" : "for this chat"}.`
  );
};

handler.help = ["on", "off", "enable", "disable", "1", "0"].map(
  (v) => v + " <option>"
);
handler.tags = ["main"];
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i;

module.exports = handler;
