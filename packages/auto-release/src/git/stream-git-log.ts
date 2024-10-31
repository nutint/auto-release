import { filter, map, Observable } from "rxjs";
import { GitCommitRange, streamGitLines } from "@/git/stream-git-lines";

import {
  InvalidGitLogCommitFormat,
  parseCommit,
} from "@/commit-parser/parse-commit";

export type ParsedCommit = {
  date: string;
  author: string;
  message: string;
  hash: string;
  tags: string[];
};

export const streamGitLog = ({
  start,
  end,
}: GitCommitRange = {}): Observable<ParsedCommit> => {
  return streamGitLines({ start, end }).pipe(
    map((gitLogString) => {
      try {
        const parsedCommit = parseCommit(gitLogString);
        return parsedCommit;
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
