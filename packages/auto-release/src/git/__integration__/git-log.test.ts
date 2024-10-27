import { describe, expect, it } from "vitest";
import { getGitLogs, getGitLogsStream, streamGitLog } from "@/git/git-log";
import { filter, firstValueFrom, lastValueFrom, map, toArray } from "rxjs";
import { createLogConfig } from "@/release-helper/release-helper";

describe("GitLog", () => {
  describe("streamGitLog", () => {
    it("should return result as fetching all commits when no parameter specified", async () => {
      const end = "HEAD";
      const $parsedGitLogs = streamGitLog({ end }).pipe(toArray());

      const parsedGitLogs = await firstValueFrom($parsedGitLogs);

      expect(parsedGitLogs).toBeTruthy();
    });

    it("should accept empty parameters when get logs", async () => {
      const $parsedGitLogsWithNoParams = streamGitLog().pipe(toArray());

      const parsedGitLogsWithNoParams = await firstValueFrom(
        $parsedGitLogsWithNoParams,
      );

      expect(parsedGitLogsWithNoParams).toBeTruthy();
    });
  });

  describe("getGitLogs", () => {
    it("should filter with scope", async () => {
      const actual = await getGitLogs(
        createLogConfig({ scope: "auto-release" }),
      );

      console.log(actual);
      expect(actual).toBeTruthy();
    });

    it("should get all if no scope filter", async () => {
      const actual = await getGitLogs(createLogConfig());

      expect(actual).toBeTruthy();
    });
  });

  describe("getGitLogStream", () => {
    it("should subscribe and get the message", async () => {
      const $result = getGitLogsStream(
        createLogConfig({ scope: "auto-release" }),
      ).pipe(
        map((commit) => commit.tags),
        filter((tags) => tags.length > 0),
        toArray(),
      );

      const result = await lastValueFrom($result);
      console.log({ result });
    });
  });
});
