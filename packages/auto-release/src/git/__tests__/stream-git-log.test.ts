import { beforeEach, describe, expect, it, vi } from "vitest";
import { streamGitLog } from "@/git/stream-git-log";
import { from, lastValueFrom, toArray } from "rxjs";
import * as StreamGitLines from "../stream-git-lines";
import * as ParseCommit from "@/commit-parser/parse-commit";
import { InvalidGitLogCommitFormat } from "@/commit-parser/parse-commit";

vi.mock("child_process", () => ({ spawn: vi.fn() }));

describe("StreamGitLog", () => {
  describe("streamGitLog", () => {
    const mockedStreamGitLines = vi.spyOn(StreamGitLines, "streamGitLines");
    const mockedParseCommit = vi.spyOn(ParseCommit, "parseCommit");

    const line1 =
      "00e4a3e74c7ca0169da7bcf5dac3ec94818acb18\n" +
      "nat\n" +
      "Tue Oct 29 22:24:55 2024 +0700\n" +
      "HEAD -> main\n" +
      "chore(repo): update dependencies version\n";
    const line2 =
      "4f79de6414b8142b7571f79ef84b40a4ff4d7db4\n" +
      "nat\n" +
      "Tue Oct 29 21:54:25 2024 +0700\n" +
      "\n" +
      "build(auto-release): make package public\n";

    const parsedCommit1 = {
      author: "nat",
      date: "Tue Oct 29 22:24:55 2024 +0700",
      hash: "00e4a3e74c7ca0169da7bcf5dac3ec94818acb18",
      message: "chore(repo): update dependencies version",
      tags: [],
    };
    const parsedCommit2 = {
      author: "nat",
      date: "Tue Oct 29 21:54:25 2024 +0700",
      hash: "4f79de6414b8142b7571f79ef84b40a4ff4d7db4",
      message: "build(auto-release): make package public",
      tags: [],
    };

    const line3InvalidFormat = "";

    const lines = [line1, line2];

    beforeEach(() => {
      vi.clearAllMocks();
      mockedStreamGitLines.mockReturnValue(from(lines));
      mockedParseCommit
        .mockReturnValueOnce(parsedCommit1)
        .mockReturnValueOnce(parsedCommit2);
    });

    it("should call streamGitLines", () => {
      streamGitLog();

      expect(mockedStreamGitLines).toHaveBeenCalledWith({});
    });

    it("should return array of conventional commits", async () => {
      const actual = await lastValueFrom(streamGitLog().pipe(toArray()));

      expect(actual).toEqual([parsedCommit1, parsedCommit2]);
    });

    it("should return only commit with valid format", async () => {
      mockedStreamGitLines.mockReturnValue(from([line1, line3InvalidFormat]));
      vi.spyOn(ParseCommit, "parseCommit").mockImplementation((logString) => {
        if (logString === line3InvalidFormat) {
          throw new InvalidGitLogCommitFormat("invalid format");
        }
        return parsedCommit1;
      });

      const actual = await lastValueFrom(streamGitLog().pipe(toArray()));

      expect(actual).toEqual([parsedCommit1]);
    });

    it("should handle other exception from parseCommit", async () => {
      mockedStreamGitLines.mockReturnValue(from([line1, line3InvalidFormat]));
      vi.spyOn(ParseCommit, "parseCommit").mockImplementation((logString) => {
        if (logString === line3InvalidFormat) {
          throw new Error("invalid format");
        }
        return parsedCommit1;
      });

      const actual = await lastValueFrom(streamGitLog().pipe(toArray()));

      expect(actual).toEqual([parsedCommit1]);
    });
  });
});
