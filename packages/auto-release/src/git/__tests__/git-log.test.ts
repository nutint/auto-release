import { beforeEach, describe, expect, it, vi } from "vitest";
import { getGitLogs, getGitLogsStream, MappedCommit } from "@/git/git-log";
import { createLogConfig } from "@/release-helper/release-helper";
import * as StreamGitLog from "@/git/stream-git-log";
import { from, lastValueFrom, toArray } from "rxjs";
import { ParsedCommit } from "@/git/stream-git-log";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";

describe("GitLogs", () => {
  const mockedStreamGitLog = vi.spyOn(StreamGitLog, "streamGitLog");
  const parsedCommit1: ParsedCommit = {
    date: "abcdef",
    author: "author",
    message: "feat(auto-release): test",
    hash: "abcdef",
    tags: [],
  };
  const parsedCommit2: ParsedCommit = {
    date: "abcdef",
    author: "author",
    message: "feat(something-else): test",
    hash: "abcdef",
    tags: [],
  };

  const mappedCommit1: MappedCommit<CommitInfo> = {
    ...parsedCommit1,
    mapped: {
      breakingChange: false,
      scope: "auto-release",
      subject: "test",
      type: "feat",
    },
  };

  const mappedCommit2: MappedCommit<CommitInfo> = {
    ...parsedCommit2,
    mapped: {
      breakingChange: false,
      scope: "something-else",
      subject: "test",
      type: "feat",
    },
  };
  const parsedCommits = [parsedCommit1, parsedCommit2];

  beforeEach(() => {
    vi.clearAllMocks();
    mockedStreamGitLog.mockReturnValue(from(parsedCommits));
  });

  describe("getGitLogsStream", () => {
    it("should call streamGitLogs with empty commit range if no commit range specified", () => {
      getGitLogsStream(createLogConfig({ scope: "auto-release" }));

      expect(mockedStreamGitLog).toHaveBeenCalledWith({});
    });

    it("should return filtered mapped commits", async () => {
      const $actual = getGitLogsStream(
        createLogConfig({ scope: "auto-release" }),
      ).pipe(toArray());

      const actual = await lastValueFrom($actual);

      expect(actual).toEqual([mappedCommit1]);
    });

    it("should return all commits when no predicated provided", async () => {
      const $actual = getGitLogsStream({
        ...createLogConfig({ scope: "auto-release" }),
        predicate: undefined,
      }).pipe(toArray());

      const actual = await lastValueFrom($actual);

      expect(actual).toEqual([mappedCommit1, mappedCommit2]);
    });
  });

  describe("getGitLogs", () => {
    it("should return filtered commits as array", async () => {
      const actual = await getGitLogs(
        createLogConfig({ scope: "auto-release" }),
      );

      expect(actual).toEqual([mappedCommit1]);
    });
  });
});
