let handler = async (m, { conn, args: [event], text }) => {
  // Extract any mentioned users after the event keyword
  let mentionsText = text.replace(event, "").trim();
  let mentionedJids = mentionsText ? conn.parseMention(mentionsText) : [];
  let participants = mentionedJids.length ? mentionedJids : [m.sender];

  // Notify about the simulation
  await m.reply(`🔄 Simulating event: ${event}...`);

  // Determine which participant update action to simulate
  let action;
  switch (event.toLowerCase()) {
    case "add":
    case "invite":
    case "welcome":
      action = "add";
      break;
    case "bye":
    case "kick":
    case "leave":
    case "remove":
      action = "remove";
      break;
    case "promote":
      action = "promote";
      break;
    case "demote":
      action = "demote";
      break;
    case "delete":
      // Simulate a message deletion
      return conn.onDelete(m);
    default:
      throw `Invalid event. Available events: welcome, bye, delete, promote, demote`;
  }

  // Simulate the group participant update
  return conn.onParticipantsUpdate({
    jid: m.chat,
    participants,
    action,
  });
};

handler.help = ["simulate <event> [@mention]"];
handler.tags = ["owner", "group"];
handler.command = /^simulate$/i;

module.exports = handler;
