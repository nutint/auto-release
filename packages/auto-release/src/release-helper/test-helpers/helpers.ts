import { from, lastValueFrom, Observable } from "rxjs";
import { CommitTypes } from "@/version/version-rules-configuration";
import { MappedCommit } from "@/git/git-log";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";

export const executeRx = async <SourceType, ReturnType>(
  source: SourceType[],
  sut: (source: Observable<SourceType>) => Observable<ReturnType>,
): Promise<ReturnType> => {
  return await lastValueFrom(from(source).pipe(sut));
};

export const createCommit = (
  type: CommitTypes,
  message: string,
  jiraIssueId?: string,
  breakingChange: boolean = false,
): MappedCommit<CommitInfo> => ({
  date: "2024-12-12",
  author: "author",
  message,
  hash: "hash",
  tags: [],
  mapped: {
    type,
    subject: message,
    breakingChange,
    jiraIssueId,
  },
});
