import { Observable, reduce } from "rxjs";
import { MappedCommit } from "@/git/git-log";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";

export type Changes = {
  major: MappedCommit<CommitInfo>[];
  minor: MappedCommit<CommitInfo>[];
  patch: MappedCommit<CommitInfo>[];
};

export const $processChangesFromGitHistory =
  () => (gitHistory: Observable<MappedCommit<CommitInfo>>) => {
    return gitHistory.pipe(
      reduce(
        (changes, mappedCommit) => {
          const {
            mapped: { type, breakingChange },
          } = mappedCommit;

          if (breakingChange) {
            return {
              ...changes,
              major: [...changes.major, mappedCommit],
            };
          } else if (["feat"].includes(type)) {
            return {
              ...changes,
              minor: [...changes.minor, mappedCommit],
            };
          } else if (["fix"].includes(type)) {
            return {
              ...changes,
              patch: [...changes.patch, mappedCommit],
            };
          }
          return changes;
        },
        { minor: [], major: [], patch: [] } as Changes,
      ),
    );
  };
