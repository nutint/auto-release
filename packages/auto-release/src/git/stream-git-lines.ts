import {
  bufferWhen,
  filter,
  fromEvent,
  map,
  Observable,
  takeUntil,
} from "rxjs";
import { spawn } from "child_process";
import readline from "readline";

export type GitCommitRange = {
  start?: string;
  end?: string;
};
export const streamGitLines = ({
  start,
  end,
}: GitCommitRange = {}): Observable<string> => {
  const rangeEnd = end ?? "HEAD";
  const range = start ? `${start}..${rangeEnd}` : rangeEnd;
  const gitLog = spawn("git", [
    "log",
    `--pretty=format:%H%n%an%n%ad%n%D%n%s%n%b%n==END==`,
    `--decorate=short`,
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
    ),
    map((commitLines) => commitLines.join("\n")),
    filter((joined) => joined.length > 0),
  );
};
