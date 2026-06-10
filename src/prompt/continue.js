import { blankLine } from "../output.js";
import { createInterface } from "node:readline";

module.exports = () => {
  const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let question = `Do you want to continue? (y/N) > `;

  return new Promise((fulfill) =>
    reader.question(question, (answer) => {
      blankLine();

      answer = (answer || "").toLowerCase();

      reader.close();

      switch (answer) {
        case "y":
        case "yes":
          return fulfill(true);

        case "n":
        case "no":
        default:
          return fulfill(false);
      }
    }),
  );
};
