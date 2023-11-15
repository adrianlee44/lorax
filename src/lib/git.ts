/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

import util from 'node:util';
import {$, execaCommand} from 'execa';

const GIT_LOG = 'git log';
const GIT_LOG_GREP_OPTION = "--grep='%s' -E";
const GIT_LOG_TAG_OPTION = '%s..HEAD';
const GIT_LOG_LINE_SEPARATOR = '==END==';
const GIT_LOG_FORMAT = `%H%n%s%n%b%n${GIT_LOG_LINE_SEPARATOR}`;
const GIT_LOG_FORMAT_OPTION = '--format=%s';

interface GetLogOptions {
  grep?: string;
  tag?: string;
}

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 */
export async function getLastTag(): Promise<string> {
  const {stdout} = await $`git describe --tags --abbrev=0`;
  return stdout.replace('\n', '');
}

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 */
export async function getLog(
  options = {} as GetLogOptions
): Promise<Array<string>> {
  const {grep, tag} = options;
  const cmdArgs = [util.format(GIT_LOG_FORMAT_OPTION, GIT_LOG_FORMAT)];

  if (grep) {
    cmdArgs.push(util.format(GIT_LOG_GREP_OPTION, grep));
  }

  if (tag) {
    cmdArgs.push(util.format(GIT_LOG_TAG_OPTION, tag));
  }

  const cmd = `${GIT_LOG} ${cmdArgs.join(' ')}`;

  const {stdout} = await execaCommand(cmd, {
    shell: true,
    stripFinalNewline: false,
  });
  return stdout ? stdout.split(`\n${GIT_LOG_LINE_SEPARATOR}\n`) : [];
}
