import { filter, map, Observable } from "rxjs";
import { GitCommitRange, streamGitLines } from "@/git/stream-git-lines";

import {
  InvalidGitLogCommitFormat,
  parseCommit,
} from "@/commit-parser/parse-commit";
import { logger } from "@/logger/logger";

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
        return parseCommit(gitLogString);
      } catch (e: unknown) {
        if (e instanceof InvalidGitLogCommitFormat) {
          logger.warn(e.message);
          return undefined;
        }
        logger.warn("error during parse commit");
        return undefined;
      }
    }),
    filter(
      (parsedCommit): parsedCommit is ParsedCommit =>
        parsedCommit !== undefined,
    ),
  );
};
