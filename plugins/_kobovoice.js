const WebSocket = require("ws");
const fs = require("fs");

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (/audio|video/.test(mime)) {
    let media = await q.download?.();
    m.reply("Please wait...");

    const websocketServer = "wss://yanzbotz-waifu-yanzbotz.hf.space/queue/join";

    function generateRandomLetters(length = 6) {
      let result = "";
      const alphabetLength = 26;
      for (let i = 0; i < length; i++) {
        const randomValue = Math.floor(Math.random() * alphabetLength);
        result += String.fromCharCode("a".charCodeAt(0) + randomValue);
      }
      return result;
    }

    const convertAudio = async (audio) => {
      return new Promise(async (resolve, reject) => {
        let name =
          Math.floor(Math.random() * 1e18) +
          (await generateRandomLetters()) +
          ".mp4";
        let result = {};

        const payloadHash = {
          fn_index: 0,
          session_hash: "xyuk2cf684b",
        };

        const payloadData = {
          fn_index: 0,
          data: [
            {
              data: "data:audio/mpeg;base64," + audio.toString("base64"),
              name: name,
            },
            10,
            "pm",
            0.6,
            false,
            "",
            "en-US-AnaNeural-Female",
          ],
          event_data: null,
          session_hash: "xyuk2cf684b",
        };

        const ws = new WebSocket(websocketServer);

        ws.onopen = () => {
          console.log("Connected to WebSocket server");
        };

        ws.onmessage = async (event) => {
          let message = JSON.parse(event.data);

          switch (message.msg) {
            case "send_hash":
              ws.send(JSON.stringify(payloadHash));
              break;
            case "send_data":
              console.log("Processing your audio...");
              ws.send(JSON.stringify(payloadData));
              break;
            case "process_completed":
              result.base64 =
                "https://yanzbotz-waifu-yanzbotz.hf.space/file=" +
                message.output.data[1].name;
              break;
          }
        };

        ws.onclose = (event) => {
          if (event.code === 1000) {
            console.log("Processing completed successfully.");
          } else {
            conn.reply(m.chat, "Error: WebSocket connection issue occurred.");
          }
          resolve(result);
        };
      });
    };

    let output = await convertAudio(await media);

    conn.sendFile(m.chat, output.base64, "", "", m);
  } else {
    m.reply(
      `Please reply to a video/audio with caption *${usedPrefix + command}*`
    );
  }
};

handler.help = ["kobovoice *Reply with video/audio*"];
handler.command = ["kobovoice"];
handler.tags = ["ai"];

module.exports = handler;
