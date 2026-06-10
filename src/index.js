#!/usr/bin/env node

import { simpleGit } from "simple-git";
import { existsSync, writeFile } from "fs-extra";
import {
  allowDirty,
  branch,
  CLI_ARGUMENTS,
  COMPOSER_JSON_DATA,
  COMPOSER_JSON_PATH,
  CURRENT_VERSION,
  PACKAGE_JSON_DATA,
  PACKAGE_JSON_PATH,
  SELF_VERSION,
  syncPackageJson,
} from "./config.js";
import {
  blankLine,
  branchConflictError,
  bumpError,
  bumpOK,
  composerVersionUpdateError,
  composerVersionUpdateOK,
  error,
  gitCommitOK,
  gitDirtyNotice,
  gitDirtyWarning,
  gitOperationError,
  gitRepoNotFound,
  gitTagOK,
  gray,
  heading,
  help,
  notABranchError,
  packageVersionUpdateError,
  packageVersionUpdateOK,
  rollbackNotice,
  success,
  updateDone,
  versionPromptMessage,
} from "./output.js";
import { done, fail } from "./helpers.js";
import { clean, lte, valid } from "semver";
import { intersection, mergeDeepRight } from "ramda";
import { promptContinue, promptVersion } from "./prompt/index.js";

const selfInfoFlags = {
  help: ["-h", "--help"],
  version: ["-v", "--version"],
};

if (argvContainsAny(...selfInfoFlags.version)) {
  console.log(SELF_VERSION);
  done();
}

heading();

if (argvContainsAny(...selfInfoFlags.help)) {
  help();
  done();
}

blankLine();
gray(`\t(i) Run 'php-composer-version -h' to see available options`);

/**
 * Main function (IIFE)
 */
(async function main() {
  blankLine();

  try {
    const isRepository = await simpleGit().checkIsRepo();

    if (!isRepository) {
      gitRepoNotFound();
      return fail();
    }

    const branches = await simpleGit().branchLocal();

    if (!branches.all.includes(branch)) {
      notABranchError(branch);
      return fail();
    }

    const status = await simpleGit().status();

    if (status.current !== branch) {
      branchConflictError(status.current);
      return fail();
    }

    const staged = await simpleGit().diff(["--name-status", "--cached"]);

    if (staged !== "") {
      if (allowDirty) {
        gitDirtyNotice(staged);
      } else {
        gitDirtyWarning(staged);

        if (!(await promptContinue())) {
          success("Aborting...");
          return done();
        }
      }
    }
  } catch (e) {
    gitOperationError(e);
    return fail();
  }

  let newVersion;

  if (config.newVersion) {
    try {
      newVersion = await expectValidVersion(config.newVersion);
      bumpOK();
    } catch (e) {
      bumpError(e);
      fail();
    }
  } else {
    newVersion = await getNewVersionFromUser();
  }

  try {
    if (syncPackageJson) {
      await writeVersionToPackageJson(newVersion);
    }

    await writeVersionToComposerJson(newVersion);
    await commitAndTag(newVersion);

    updateDone(newVersion);
    done();
  } catch (e) {
    rollbackNotice();

    await rollbackComposerJson();

    if (syncPackageJson) {
      await rollbackPackageJson();
    }

    fail();
  }
})();

/**
 * Function to recursively prompt the user for a new version number, until
 * a valid string is supplied.
 *
 * @param {number} attempt
 * @return {Promise<string>}
 */
async function getNewVersionFromUser(attempt = 1) {
  if (attempt === 1) {
    versionPromptMessage();
  }

  try {
    const version = await promptVersion();

    await expectValidVersion(version);
    bumpOK();
    blankLine();
    return clean(version);
  } catch (error) {
    bumpError(error);
    return getNewVersionFromUser(attempt + 1);
  }
}

/**
 * Reverts the package.json file to its state at the start of this process,
 * if it currently exists. No action is taken otherwise.
 *
 * @return {Promise<void>}
 */
async function rollbackComposerJson() {
  if (!existsSync(COMPOSER_JSON_PATH)) {
    return;
  }

  await writeFile(COMPOSER_JSON_PATH, formatJSON(COMPOSER_JSON_DATA));
}

/**
 * Reverts the package.json file to its state at the start of this process,
 * if it currently exists. No action is taken otherwise.
 *
 * @return {Promise<void>}
 */
async function rollbackPackageJson() {
  if (!existsSync(PACKAGE_JSON_PATH)) {
    return;
  }

  await writeFile(PACKAGE_JSON_PATH, formatJSON(PACKAGE_JSON_DATA));
}

/**
 * Writes given version to the project's composer.json file. If the file does not yet
 * exist, it is created with `"version"` as only key.
 *
 * @param version
 * @return {Promise<*>}
 */
async function writeVersionToComposerJson(version) {
  const json = formatJSON(mergeDeepRight(COMPOSER_JSON_DATA, { version }));

  try {
    await writeFile(COMPOSER_JSON_PATH, json);
    composerVersionUpdateOK();
  } catch (error) {
    composerVersionUpdateError(error);
    throw error;
  }

  return version;
}

/**
 * Writes given version to the project's package.json file. If the file does not yet
 * exist, it is created with `"version"` as only key.
 *
 * @param version
 * @return {Promise<*>}
 */
async function writeVersionToPackageJson(version) {
  const json = formatJSON(mergeDeepRight(PACKAGE_JSON_DATA, { version }));

  try {
    await writeFile(PACKAGE_JSON_PATH, json);
    packageVersionUpdateOK();
  } catch (error) {
    packageVersionUpdateError(error);
    throw error;
  }

  return version;
}

/**
 * Get the list of touched files add to the version commit.
 *
 * @return {*[]}
 */
function filesToCommit() {
  const files = [COMPOSER_JSON_PATH];

  if (syncPackageJson) {
    files.push(PACKAGE_JSON_PATH);
  }

  return files;
}

/**
 * Creates a commit named by given version, including all touched files, and
 * whatever was already staged. The commit is tagged with the version number
 * afterwards.
 *
 * @param version
 * @return {Promise<void>}
 */
async function commitAndTag(version) {
  const commitMessage = commitMessage
    ? commitMessage.replace(/%s/, version)
    : version;

  try {
    await simpleGit().add(filesToCommit());
    await simpleGit().commit(commitMessage);
    gitCommitOK();

    await simpleGit().addTag(version);
    gitTagOK();
  } catch (e) {
    error("Git error: ", e);
    throw e;
  }
}

/**
 * Asserts the validity of given version number as the new version for the
 * package: It must be a valid format, and a version greater than the
 * current version, if defined.
 *
 * @param {string} version
 * @return {version}
 */
async function expectValidVersion(version) {
  if (valid(version) === null) {
    throw new Error(`Invalid version number '${version}'`);
  }

  if (CURRENT_VERSION && lte(version, CURRENT_VERSION)) {
    throw new Error(
      `New version '${version}' must be greater than current version '${CURRENT_VERSION}'`,
    );
  }

  if (await tagExists(version)) {
    throw new Error(`Tag '${version}' already exists`);
  }

  return version;
}

/**
 * Checks if a Git tag exists by the name of given version number.
 *
 * @param {string} version
 * @return {Promise<boolean>}
 */
async function tagExists(version) {
  const tags = await simpleGit().tags();
  return tags.all.some((tag) => tag === clean(version));
}

/**
 * JSON stringify a given object in a readable way: with line breaks and indents.
 *
 * @param {object} object
 * @return {string}
 */
function formatJSON(object) {
  return JSON.stringify(object, null, 4) + "\n";
}

/**
 * Tests if any in the array of given CLI flags were actually given as argument(s)
 * to the current process.
 *
 * @param {...string} flags
 * @return {boolean}
 */
function argvContainsAny(...flags) {
  return intersection(flags, CLI_ARGUMENTS).length >= 1;
}
