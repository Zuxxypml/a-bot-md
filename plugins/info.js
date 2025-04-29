let handler = async (m, { conn }) => {
  let { anticall, backup, groupOnly, restrict, autoread, autoreact, autoresp } =
    global.db.data.settings[conn.user.jid] || {};
  const users = Object.values(global.db.data.users || {});
  const users_registered = users.filter((v) => v.registered);
  const chats = Object.values(conn.chats || {});
  const groups = chats.filter((v) => v.id.endsWith("g.us") && !v.read_only);
  const groups_leave = chats.filter(
    (v) => v.id.endsWith("g.us") && v.read_only
  );
  let allHits = Object.entries(global.db.data.stats || {})
    .map((v) => v[1].total)
    .reduce((a, b) => a + b, 0);
  let _uptime = process.uptime() * 1000;
  let uptime = conn.clockString(_uptime);

  let botInfo = `
╔════════════════
║  🤖 BOT INFORMATION
╠════════════════
║  ⏳ Uptime: ${uptime}
║  🎯 Total Hits: ${allHits}
║  ⚙️ Total Features: ${
    Object.values(global.plugins || {}).filter((v) => !v.all && !v.before)
      .length
  }
║  
║  👥 USERS STATISTICS
║  • Total Users: ${users.length}
║  • Registered Users: ${users_registered.length}
║  • Premium Users: ${global.prems?.length || 0}
║  • Banned Users: ${
    Object.entries(global.db.data.users || {}).filter(
      ([_, user]) => user.banned
    ).length
  }
║  
║  💬 CHAT STATISTICS
║  • Private Chats: ${chats.length - groups.length}
║  • Banned Chats: ${
    Object.entries(global.db.data.chats || {}).filter(
      ([_, chat]) => chat.isBanned
    ).length
  }
║  • Active Groups: ${groups.length}
║  • Left Groups: ${groups_leave.length}
║  
║  ⚙️ BOT SETTINGS
║  • Anti-Call: ${anticall ? "✅" : "❌"}
║  • Auto Backup: ${backup ? "✅" : "❌"}
║  • Group Only: ${groupOnly ? "✅" : "❌"}
║  • Restrictions: ${restrict ? "✅" : "❌"}
║  • Auto Read: ${autoread ? "✅" : "❌"}
║  • Auto React: ${autoreact ? "✅" : "❌"}
║  • Auto Response: ${autoresp ? "✅" : "❌"}
╚════════════════`.trim();

  await m.reply(botInfo);
};

handler.help = ["botinfo", "info"];
handler.tags = ["info", "tools"];
handler.command = /^(botinfo|info|status)$/i;

module.exports = handler;
