const fs = require("fs");
const { spawn } = require("child_process");

// Python code as a string
const pythonCode = `
from pydub import AudioSegment
import time
from colorama import Fore, init
import threading

# Initialize colorama
init(autoreset=True)

# Delays for each lyric
delays = [
    0.10, 0.10, 0.15, 0.16, 0.15,
    0.14, 0.12, 0.15, 0.15, 0.14,
    0.13, 0.14, 0.12, 0.15, 0.14,
    0.14, 0.14
]

# Load the audio file
audio_file_path = 'koiire_kobo.mp3'
song = AudioSegment.from_mp3(audio_file_path)
song.export('output.wav', format='wav')

# Lyrics with timestamps
lyrics = [
    (0, "Mom said kids shouldn't fall in love yet"),
    (5, "But..."),
    (6.7, "You were far yet so close"),
    (12.12, "It felt like fate"),
    (17, "Always next to me"),
    (21, "You always looked only at me"),
    (27, "I love you"),
    (28, "Now I send my feelings to you"),
    (32, "Look"),
    (33, "I'm being honest now"),
    (36, "Can I stay by your side forever?"),
    (42, "Our love overlaps"),
    (46, "I love you"),
    (47, "Now my feelings reach you"),
    (51, "Hey, can't you notice?"),
    (56, "My heart helplessly falls deeper"),
    (60, "Falling in love completely")
]

# Colors for each lyric
colors = [Fore.RED, Fore.GREEN, Fore.YELLOW, Fore.BLUE, Fore.MAGENTA, Fore.CYAN, Fore.WHITE]

# Function to display lyrics with typing effect
def display_lyrics(lyrics, delays):
    start_time = time.time()
    for i, (timestamp, line) in enumerate(lyrics):
        while time.time() - start_time < timestamp:
            time.sleep(0.1)
        color = colors[i % len(colors)]
        for char in line:
            print(color + char, end='', flush=True)
            time.sleep(delays[i])
        print()

# Run typing effect
lyrics_thread = threading.Thread(target=display_lyrics, args=(lyrics, delays))
lyrics_thread.start()
`;

const pythonFilePath = "temp_script.py";
fs.writeFileSync(pythonFilePath, pythonCode);

// Function to run Python script
const runPythonScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [scriptPath]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
};

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn }) => {
  const loadingStages = [
    "Buying snacks...",
    "Applying band-aid...",
    "I love you!!..",
    "Now sending my feelings to you...",
    "Look, I'm finally honest!!..",
    "Can I stay by your side forever?",
    "Our love overlaps!!",
    "I love you!!..",
  ];

  const stageDelays = [120, 120, 120, 150, 150, 140, 130, 140]; // milliseconds

  let { key } = await conn.sendMessage(m.chat, { text: "ʟ ᴏ ᴀ ᴅ ɪ ɴ ɢ..." });

  for (let i = 0; i < loadingStages.length; i++) {
    await delay(stageDelays[i]);
    await conn.sendMessage(m.chat, { text: loadingStages[i], edit: key });
  }

  // Run the Python script
  await runPythonScript(pythonFilePath)
    .then(() => {
      console.log("Python script finished successfully.");
      fs.unlinkSync(pythonFilePath);
    })
    .catch((error) => {
      console.error("Error running Python script:", error);
      fs.unlinkSync(pythonFilePath);
    });

  const audioFilePath = "output.wav";
  if (fs.existsSync(audioFilePath)) {
    await conn.sendMessage(m.chat, {
      audio: { url: audioFilePath },
      mimetype: "audio/wav",
      ptt: true,
    });
    fs.unlinkSync(audioFilePath); // Cleanup after sending
  } else {
    console.error("Audio file not found.");
  }
};

handler.help = ["loading"];
handler.tags = ["fun"];
handler.command = /^(loading)$/i;

module.exports = handler;
