async function handler(m, { command, usedPrefix }) {
  command = command.toLowerCase();
  if (!global.db.data.settings[conn.user.jid].anonymous)
    return m.reply("This feature is disabled due to spam.");
  this.anonymous = this.anonymous
    ? this.anonymous
    : db.data.sessions[conn.user.jid].anonymous;
  for (let id in this.anonymous) {
    this.anonymous[id].check = check;
    this.anonymous[id].other = other;
  }
  switch (command) {
    case "next":
    case "leave": {
      let room = Object.values(this.anonymous).find((room) =>
        room.check(m.sender)
      );
      if (!room)
        throw `You're not currently in an anonymous chat, type *${usedPrefix}start* to begin.`;
      m.reply("Ok, leaving...");
      let other = room.other(m.sender);
      if (other) this.reply(other, "Your chat partner has left.");
      delete this.anonymous[room.id];
      if (command === "leave") break;
    }
    case "start": {
      if (Object.values(this.anonymous).find((room) => room.check(m.sender)))
        throw "You are already in an anonymous chat!";
      let room = Object.values(this.anonymous).find(
        (room) => room.state === "WAITING" && !room.check(m.sender)
      );
      if (room) {
        this.reply(room.a, "Found a partner! 👤");
        room.b = m.sender;
        room.state = "CHATTING";
        m.reply("Partner found!\nYou can start chatting now.");
      } else {
        let id = +new Date();
        this.anonymous[id] = {
          id,
          a: m.sender,
          b: "",
          state: "WAITING",
        };
        m.reply("Waiting for a partner to join...");
      }
      break;
    }
  }
}

handler.help = handler.command = ["start", "leave", "next"];
handler.tags = ["anonymous"];
handler.private = true;

module.exports = handler;

function check(who = "") {
  return [this.a, this.b].includes(who);
}
function other(who = "") {
  return who === this.a ? this.b : who === this.b ? this.a : "";
}
