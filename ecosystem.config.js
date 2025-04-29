module.exports = {
  apps: [
    {
      name: "A-MD-mongo",
      script: "npm",
      args: "run mongo",
      watch: false
    },
    {
      name: "A-MD",
      script: "index.js",
      args: "--db \"mongodb://localhost:27017/aBotDB\"",
      watch: false
    }
  ]
}

