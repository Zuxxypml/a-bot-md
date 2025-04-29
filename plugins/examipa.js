const { proto } = require("@whiskeysockets/baileys").default;

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let M = proto.WebMessageInfo;
  let chats = db.data.chats[m.chat];
  let msgs = chats.listStr || {};

  let data = [
    {
      soal: "Observe the table below!\n\n1. Squid > Emits light\n2. Pangolin > Releases a strong smell\n3. Catfish > Has whiskers\n4. Woodpecker > Has a sharp and curved beak\n\nWhich pair correctly shows the animal and its adaptation?\n\na 1 and 2\nb 1 and 3\nc 2 and 3\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "The force acting on a bicycle tire when braking is ....\n\na friction\nb spring\nc gravity\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "One of the characteristics of objects floating on water is, except ....\n\na object density less than water density\nb object volume smaller than displaced water volume\nc object weight less than displaced water weight\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "The force acting on a free-falling object is ....\n\na friction\nb gravity\nc spring force\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "One property of light is ....\n\na cannot be refracted\nb can be reflected\nc has no speed\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "Which planet appears red?\n\na Mercury\nb Venus\nc Earth\nd Mars\ne Jupiter\n\n_to answer type .exipa a/b/c/d/e_",
      jawaban: "d",
    },
    {
      soal: "Which of the following is NOT an example of circular motion?\n\na a basketball spinning on a finger\nb a spinning fan\nc pulling a clock spring\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "Which planet has the shortest revolution time?\n\na Mercury\nb Venus\nc Earth\nd Mars\n\n_to answer type .exipa a/b/c/d_",
      jawaban: "a",
    },
    {
      soal: "The picture shows a plane that is ....\n\na landing\nb flying\nc struck by lightning\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "An object affected by gravity will fall toward Earth's center because ....\n\na there is a gravitational field on Earth\nb there is a gravitational field inside the object\nc there is a gravitational field in the sky\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "Which of the following is NOT a property of light?\n\na reflection\nb propagation\nc weight\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "The safest way to cross the river is by using ....\n\na a raft\nb a motorboat\nc a bridge",
      jawaban: "c",
    },
    {
      soal: "One benefit of gravity for humans is, except ....\n\na keeping humans on Earth\nb helping humans move\nc allowing humans to fly\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "The activity shown in the image above is ....\n\na cooking\nb rowing\nc reading a book\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "An object with density greater than water will ....\n\na sink\nb float\nc stay on water surface\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "The object shown above is a ....\n\na balloon\nb ship\nc airplane\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "The function of the spring in the picture is ....\n\na to provide cool air\nb to make opening doors easier\nc to help the door close automatically\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "Objects floating on water experience ....\n\na tension\nb pressure\nc buoyant force\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "Which planet has the most moons?\n\na Mercury\nb Venus\nc Earth\nd Mars\n\n_to answer type .exipa a/b/c/d_",
      jawaban: "d",
    },
    {
      soal: "A musical instrument played by striking is ....\n\na piano\nb violin\nc guitar\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "The function of the object shown above is ....\n\na frying\nb measuring\nc mixing\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "One benefit of gravity is ....\n\na keeping Earth orbiting the Sun\nb keeping humans on Earth\nc keeping water flowing to the sea\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "The activity being performed by the person shown above is ....\n\na swimming\nb dancing\nc reading a book\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "When an object is kicked, it will ....\n\na stop\nb change movement\nc move\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "The musical instrument shown above is ....\n\na guitar\nb drum\nc violin\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "In a pushing force, the type of force working is ....\n\na magnetic force\nb frictional force\nc compressive force\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
    {
      soal: "The object shown above is a ....\n\na chair\nb table\nc cupboard\n\n_to answer type .exipa a/b/c_",
      jawaban: "b",
    },
    {
      soal: "One benefit of gravity for humans is ....\n\na keeping humans on Earth\nb allowing humans to fly\nc helping humans float in water\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "The object shown above is a ....\n\na wall clock\nb refrigerator\nc cupboard\n\n_to answer type .exipa a/b/c_",
      jawaban: "a",
    },
    {
      soal: "The purpose of the tool shown above is ....\n\na to measure temperature\nb to clean glass\nc to write\n\n_to answer type .exipa a/b/c_",
      jawaban: "c",
    },
  ];

  switch (command) {
    case "examipa":
      let randomIndex = Math.floor(Math.random() * data.length);
      let randomSoal = data[randomIndex].soal;
      conn.reply(m.chat, randomSoal, m);
      break;

    case "exipa":
      let userAnswer = text.toLowerCase();
      let randomIndexEx = Math.floor(Math.random() * data.length);
      let correctAnswer = data[randomIndexEx].jawaban;
      if (userAnswer === correctAnswer) {
        conn.reply(m.chat, "Your answer is correct! 🎉", m);
      } else {
        conn.reply(m.chat, "Your answer is incorrect. 😔", m);
      }
      break;

    default:
      throw `Invalid command: ${command}`;
  }
};

handler.tags = ["game"];
handler.command = /^(examipa|exipa)$/i;
handler.help = [
  "examipa - Get a random science question",
  "exipa [answer] - Answer the science question",
];

module.exports = handler;
