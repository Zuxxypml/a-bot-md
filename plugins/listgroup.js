let handler = async (m, { conn }) => {
  let now = new Date() * 1;
  let groups = Object.values(conn.chats)
    .filter((v) => v.id.endsWith("g.us"))
    .sort((a, b) => (a.subject || "").localeCompare(b.subject || ""));

  if (groups.length === 0) {
    return conn.reply(m.chat, "The bot is not currently in any groups.", m);
  }

  let groupList = groups
    .map((v) => {
      let groupData = global.db.data.chats[v.id] || {};
      let status = v.read_only ? "Left" : "Joined";
      let expiration = groupData.permanent
        ? "Permanent"
        : !groupData.gcdate
        ? "Not registered"
        : groupData.gcdate < now
        ? "Expired"
        : conn.msToDate(groupData.gcdate - now);

      return (
        `*${v.subject || "No Subject"}*\n` +
        `ID: ${v.id}\n` +
        `Status: ${status}\n` +
        `Expiration: ${expiration}`
      );
    })
    .join("\n\n");

  conn.reply(
    m.chat,
    `*LIST OF GROUPS*\n` +
      `Total: ${groups.length} groups\n\n` +
      `${groupList}`,
    m
  );
};

handler.help = ["groups", "listgroups"];
handler.tags = ["info"];
handler.command = /^(listgroups?|groupslist|grouplist)$/i;

module.exports = handler;
