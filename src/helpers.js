/**
 * Exit the process with success semantics.
 *
 * @return never
 */
function done() {
  process.exit(0);
}

/**
 * Exit the process with error semantics.
 *
 * @return never
 */
function fail() {
  console.log("Failed.");
  process.exit(1);
}

module.exports = {
  done,
  fail,
};
