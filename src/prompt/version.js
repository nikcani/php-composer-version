const readline = require("node:readline");
module.exports = () => {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  return new Promise((fulfill) =>
    reader.question("\tversion > ", (version) => {
      reader.close();
      fulfill(version);
    }),
  );
};
