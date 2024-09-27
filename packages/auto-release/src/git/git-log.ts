import { spawn } from "child_process";
import readline from "readline";
import {
  bufferWhen,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  Observable,
  takeUntil,
  toArray,
} from "rxjs";

export type GitCommitRange = {
  start?: string;
  end?: string;
};

export class InvalidGitLogCommitFormat extends Error {
  constructor(message: string) {
    super(`InvalidGitLogCommitFormat: ${message}`);
  }
}

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
  };
};

export type ParsedCommit = {
  date: string;
  author: string;
  message: string;
  hash: string;
};

export type MappedCommit<T> = ParsedCommit & { mapped: T };

export const streamGitLog = ({
  start,
  end,
}: GitCommitRange = {}): Observable<ParsedCommit> => {
  const rangeEnd = end ?? "HEAD";
  const range = start ? `${start}..${rangeEnd}` : rangeEnd;
  const gitLog = spawn("git", [
    "log",
    `--pretty=format:%H%n%an%n%ad%n%s%n%b%n==END==`,
    range,
  ]);

  const gitLogStream = readline.createInterface({
    input: gitLog.stdout,
    terminal: false,
  });

  return fromEvent(gitLogStream, "line").pipe(
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
          console.log("WARN: ", e.message);
          return undefined;
        }
        console.log("WARN: error during parse commit");
        return undefined;
      }
    }),
    filter(
      (parsedCommit): parsedCommit is ParsedCommit =>
        parsedCommit !== undefined,
    ),
  );
};

export type GetLogConfig<T> = {
  mapper: (commitMessage: string) => T;
  predicate?: (mappedCommit: MappedCommit<T>) => boolean;
};

export const getGitLogs = async <T>(
  getLogConfig: GetLogConfig<T>,
  gitCommitRange: GitCommitRange = {},
): Promise<MappedCommit<T>[]> => {
  const $result = streamGitLog(gitCommitRange).pipe(
    map((parsedCommit) => {
      return {
        ...parsedCommit,
        mapped: getLogConfig.mapper(parsedCommit.message),
      };
    }),
    filter(getLogConfig.predicate ? getLogConfig.predicate : () => true),
    toArray(),
  );
  return await firstValueFrom($result);
};
