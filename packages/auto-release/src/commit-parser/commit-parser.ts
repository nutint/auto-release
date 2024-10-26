import { GitCommitRange, InvalidGitLogCommitFormat } from "@/git/git-log";
import { parseConventionalMessage } from "@/conventional-commit-helper/conventional-commit-helper";
import { spawn } from "child_process";
import readline from "readline";
import {
  bufferWhen,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  takeUntil,
  toArray,
} from "rxjs";

export const streamGitLog = async ({ start, end }: GitCommitRange) => {
  const range = start ? `${start}..${end}` : `${end}`;
  const gitLog = spawn("git", [
    "log",
    `--pretty=format:%H%n%an%n%ad%n%s%n%b%n==END==`,
    range,
  ]);

  const gitLogStream = readline.createInterface({
    input: gitLog.stdout,
    terminal: false,
  });

  const $changeLogArray = fromEvent(gitLogStream, "line").pipe(
    takeUntil(fromEvent(gitLogStream, "close")),
    filter((line) => line !== "==END=="), // Filter out the delimiter
    bufferWhen(() =>
      fromEvent(gitLogStream, "line").pipe(
        filter((line) => line === "==END=="),
      ),
    ), // Buffer until '==END=='
    map((commitLines) => commitLines.join("\n")),
    map((gitLogString) => {
      try {
        return parseCommit(gitLogString);
      } catch (e: unknown) {
        if (e instanceof InvalidGitLogCommitFormat) {
          return undefined;
        } else throw e;
      }
    }),
    toArray(), // Collect all formatted entries into an array
  );
  return await firstValueFrom($changeLogArray);
};
export const parseCommit = (commitLogString: string) => {
  const lines = commitLogString.split("\n");
  const hash = lines[0];
  const author = lines[1];
  const date = lines[2];
  const message = lines.slice(3).join("\n").trim();

  if (lines.length < 4) {
    throw new InvalidGitLogCommitFormat("Empty commit message");
  }

  return {
    hash,
    author,
    date,
    message,
    parsedConventionalCommit: parseConventionalMessage(message),
  };
};
