import { clone } from "ramda";
import pkg from "../package.json" with { type: "json" };
import { existsSync, readFileSync } from "fs-extra";
import { resolve } from "node:path";

const { description, homepage, version } = pkg;

const CLI_ARGUMENTS = process.argv.slice(2);

const PACKAGE_JSON_PATH = resolve(process.cwd(), "package.json");
const COMPOSER_JSON_PATH = resolve(process.cwd(), "composer.json");

const PACKAGE_JSON_DATA = existsSync(PACKAGE_JSON_PATH)
  ? JSON.parse(readFileSync(PACKAGE_JSON_PATH, { encoding: "utf8" }))
  : {};

const COMPOSER_JSON_DATA = existsSync(COMPOSER_JSON_PATH)
  ? JSON.parse(readFileSync(COMPOSER_JSON_PATH, { encoding: "utf8" }))
  : {};

const defaultOptions = {
  commitMessage: null,
  syncPackageJson: false,
  allowDirty: false,
  branch: "master",
  newVersion: null,
};

// -----------------------------------------------------------------------------
//      Read CLI arguments
// -----------------------------------------------------------------------------
const argv = clone(CLI_ARGUMENTS);
while (argv.length) {
  let arg = argv.shift();
  const indexOfEqualSign = arg.indexOf("=");

  if (indexOfEqualSign !== -1) {
    arg = arg.slice(0, indexOfEqualSign);
    argv.unshift(arg.slice(indexOfEqualSign + 1));
  }

  switch (arg) {
    case "-d":
    case "--allow-dirty":
      defaultOptions.allowDirty = true;
      break;

    case "-p":
    case "--sync-package-json":
      defaultOptions.syncPackageJson = true;
      break;

    case "-b":
    case "--branch":
      defaultOptions.branch = argv.shift();
      break;

    case "-V":
    case "--set-version":
      defaultOptions.newVersion = argv.shift();
      break;

    case "-m":
    case "--message":
      defaultOptions.commitMessage = argv.shift();
      break;
  }
}

exports.CURRENT_VERSION = COMPOSER_JSON_DATA.version || null;

exports.commitMessage = defaultOptions.commitMessage;
exports.syncPackageJson = defaultOptions.syncPackageJson;
exports.allowDirty = defaultOptions.allowDirty;
exports.branch = defaultOptions.branch;
exports.newVersion = defaultOptions.newVersion;

exports.PACKAGE_JSON_PATH = PACKAGE_JSON_PATH;
exports.PACKAGE_JSON_DATA = PACKAGE_JSON_DATA;
exports.COMPOSER_JSON_PATH = COMPOSER_JSON_PATH;
exports.COMPOSER_JSON_DATA = COMPOSER_JSON_DATA;
exports.CLI_ARGUMENTS = CLI_ARGUMENTS;

exports.SELF_VERSION = version;
exports.SELF_DESCRIPTION = description;
exports.SELF_URL = homepage;
