let handler = (m) => m;

handler.before = async function (m) {
  // Check if the message is a number (potential answer)
  if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return true;

  let id = m.sender;
  // Verify this is a reply to our math question
  if (
    !m.quoted ||
    m.quoted.sender != this.user.jid ||
    !/^What is the result of/i.test(m.quoted.text)
  )
    return true;

  // Initialize math storage if needed
  this.math = this.math ? this.math : {};

  // Check if question exists
  if (!(id in this.math)) return m.reply("That question has expired");

  // Process the answer
  if (m.quoted.id == this.math[id][0].id) {
    let math = JSON.parse(JSON.stringify(this.math[id][1]));

    if (m.text == math.result) {
      // Correct answer
      global.db.data.users[m.sender].exp += math.bonus;
      clearTimeout(this.math[id][3]);
      delete this.math[id];
      m.reply(`*Correct Answer!*\n+${math.bonus} XP`);
    } else {
      // Wrong answer
      if (--this.math[id][2] == 0) {
        // No attempts left
        clearTimeout(this.math[id][3]);
        delete this.math[id];
        m.reply(`*No attempts left!*\nAnswer: *${math.result}*`);
      } else {
        // Attempts remaining
        m.reply(
          `*Wrong Answer!*\nYou have ${this.math[id][2]} more attempt(s)`
        );
      }
    }
  }
  return true;
};

module.exports = handler;
