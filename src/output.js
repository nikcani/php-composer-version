import chalk from "chalk";
import {
  branch,
  CURRENT_VERSION,
  SELF_DESCRIPTION,
  SELF_URL,
  SELF_VERSION,
} from "./config.js";

const LF = "\n";
const TAB = "\t";

const log = (x) => console.log(x);

const blankLine = () => {
  log(" ");
};

function error(message) {
  console.error(chalk.red(message));
}

function warning(message) {
  console.warn(chalk.yellow(message));
}

function success(message) {
  log(chalk.green(message));
}

function gray(message) {
  log(chalk.gray(message));
}

const processLines = {
  versionBumpOK: "Version bump            =>   OK",
  gitTagOK: "Git tag                 =>   OK",
  gitCommitOK: "Git commit              =>   OK",
  packageOK: "Update package.json     =>   OK",
  composerOK: "Update composer.json    =>   OK",
};

/**
 *
 * @param {string} staged - raw output of `$ git diff --name-status --cached`
 * @return {string}
 */
function changedFilesContent(staged) {
  const fileLines = staged
    .replace(/^A\t/gm, "Added:    ")
    .replace(/^M\t/gm, "Modified: ")
    .replace(/^D\t/gm, "Deleted:  ")
    .replace(/^R\d+\t/gm, "Renamed:  ")
    .replace(/(\S+)$/gm, `${process.cwd()}/$1`)
    .split(LF);

  return ["Changes to be committed:", "------------------------", ...fileLines]
    .map((line) => TAB + line)
    .join(LF);
}

exports = {
  gray,
  success,
  error,
  blankLine,

  heading() {
    const title = chalk.bold.green(`php-composer-version @ ${SELF_VERSION}`);
    const url = chalk.bold(SELF_URL);

    blankLine();

    log(`${title} | ${url}`);

    gray(SELF_DESCRIPTION);
  },

  gitRepoNotFound() {
    error(`Git error: not a repository (cwd: ${process.cwd()})`);
  },

  gitOperationError(e) {
    error("Git error: " + e);
  },

  notABranchError(name) {
    error(`Git branch error:   Invalid branch name '${name}'.`);

    blankLine();
  },

  branchConflictError(currentBranch) {
    error(
      [
        `Git branch error:   Cannot create release on current branch '${currentBranch}'`,
        `                    as the target branch is set to '${branch}'`,
      ].join(LF),
    );

    blankLine();
  },

  /**
   * @param {string} staged
   */
  gitDirtyNotice(staged) {
    blankLine();
    gray(
      `Git status notice:  Git stage not clean. Staged changes will be committed along with the updated files.`,
    );
    blankLine();
    gray(changedFilesContent(staged));
  },

  /**
   * @param {string} staged
   */
  gitDirtyWarning(staged) {
    warning(
      `Git status warning: Git stage not clean. Staged changes will be committed along with the updated files.`,
    );
    blankLine();

    gray(changedFilesContent(staged));
  },

  gitCommitOK() {
    success(processLines.gitCommitOK);
  },

  gitTagOK() {
    success(processLines.gitTagOK);
  },

  bumpOK() {
    success(`${TAB}Version bump OK`);
  },

  bumpError(e) {
    error(`${TAB}Version bump Error: ${e}`);
  },

  versionPromptMessage() {
    log(
      `Enter new version number (current version: ${CURRENT_VERSION || "none"})`,
    );
  },

  composerVersionUpdateOK() {
    success(processLines.composerOK);
  },

  composerVersionUpdateError(message) {
    error("Failed to save new version to composer.json:");
    gray(TAB + message);
    blankLine();
  },

  packageVersionUpdateOK() {
    success(processLines.packageOK);
  },

  packageVersionUpdateError(message) {
    error("Failed to save new version to package.json:");
    gray(TAB + message);
    blankLine();
  },

  rollbackNotice() {
    log(`Rolling back package manager files...`);
    blankLine();
  },

  updateDone(newVersion) {
    success(`Done. (${CURRENT_VERSION} => ${newVersion})${LF}`);
  },

  help() {
    log(`
        
  ....            ...........................          
 ....  .         ..........................  ..        
      ...                             ....  ....       
 ..... ....     .................... .... .....        
  ..... ....     .....              .... ....          
   ..... ....      ....  ...       .... ....           
    ..... ....      ....  ...     .... ....            
     .....  ...      ..... ....  ...  ....      ....   
      .....  ...      ..... .... ..  ....      .... .. 
        ....  ...      ..... ....   ....      .... ....
         ..... ....     .....  ...  ..      ....  .... 
          ..... ....      ....  ...        ....  ....  
           ..... ....      ....  ...      ....  ....   
            .....  ...      ..... ....   ....  ....    
              ....  ...  ... ..... .... .... .....     
               ....  ...  .   ..... .... .. ....       
                ..... ....  .. .....  ...  ....        
                 ..... ........ .....  .......         
                  ..... .....     ....  .....          
                   .....  ..       ..... ...
                           
Usage: php-composer-version [options]

${chalk.yellow("Self info:")}
    ${chalk.green("-h, --help")}                       Display this help message.
    ${chalk.green("-v, --version")}                    Show current version of php-composer-version.
    
${chalk.yellow("Options:")}
    ${chalk.green("-V, --set-version <new-version>")}  The new package version to write. If not provided, php-composer-version will prompt interactively.
    ${chalk.green("-b, --branch <name>")}              Set the branch for the version commit. If on any other branch, the process will fail. ${chalk.yellow('[default: "master"]')} 
    ${chalk.green("-m, --message <message>")}          Specify a custom message for the version commit. ${chalk.yellow("%s")} within a given message is replaced with the version number. ${chalk.yellow("[default: <new-version>]")} 
    ${chalk.green("-d, --allow-dirty")}                Allow additional changes to be committed with the version commit.
    ${chalk.green("-p, --sync-package-json")}          Toggle additional update of the version number in package.json.
`);
  },
};
