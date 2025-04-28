let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let codeToConvert = text || (m.quoted && m.quoted.text);

  if (!codeToConvert)
    throw `Please enter or reply to the code you want to convert.`;

  let result;
  if (command === "toesm") {
    result = convertCJSToESM(codeToConvert);
  } else if (command === "tocjs") {
    result = convertESMToCJS(codeToConvert);
  } else {
    throw `Unknown command.`;
  }

  m.reply(result);
};

handler.help = ["toesm <code>", "tocjs <code>"];
handler.tags = ["code"];
handler.command = /^(toesm|tocjs)$/i;
handler.limit = true;

module.exports = handler;

// Function to convert CJS to ESM with better handling
function convertCJSToESM(code) {
  return code
    .replace(
      /const (\w+) = require\(['"](.+?)['"]\);?/g,
      "import $1 from '$2';"
    )
    .replace(/let (\w+) = require\(['"](.+?)['"]\);?/g, "import $1 from '$2';")
    .replace(/var (\w+) = require\(['"](.+?)['"]\);?/g, "import $1 from '$2';")
    .replace(/module\.exports\s*=\s*(.*?);?/g, "export default $1;")
    .replace(/exports\.(\w+)\s*=\s*(.*?);?/g, "export const $1 = $2;")
    .replace(/require\(['"](.+?)['"]\)/g, "await import('$1')"); // Handles dynamic imports
}

// Function to convert ESM to CJS with edge case handling
function convertESMToCJS(code) {
  return code
    .replace(/import (\w+) from ['"](.+?)['"];/g, "const $1 = require('$2');")
    .replace(
      /import \* as (\w+) from ['"](.+?)['"];/g,
      "const $1 = require('$2');"
    )
    .replace(/import \{(.*?)\} from ['"](.+?)['"];/g, (match, p1, p2) => {
      const imports = p1.split(",").map((i) => i.trim());
      return `const { ${imports.join(", ")} } = require('${p2}');`;
    })
    .replace(/export default (\w+);?/g, "module.exports = $1;")
    .replace(/export const (\w+) = (\w+);?/g, "exports.$1 = $2;")
    .replace(/export (.*?) from ['"](.+?)['"];/g, (match, p1, p2) => {
      return `module.exports.${p1} = require('${p2}');`;
    }); // Handles re-exports
}
