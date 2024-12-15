import { describe, expect, it } from "vitest";
import { createCommit, executeRx } from "@/release-helper/test-helpers/helpers";
import { MappedCommit } from "@/git/git-log";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";
import { $processChangesFromGitHistory } from "@/release-helper/process-changes-from-git-history";

describe("ProcessChangesFromGitHistory", () => {
  describe("$processChangesFromGitHistory", () => {
    const feature1 = createCommit("feat", "feature 1");
    const fix1 = createCommit("fix", "fix 1");
    const fix2 = createCommit("fix", "fix 2");
    const chore1 = createCommit("chore", "chore 1");
    const breakingChange = createCommit(
      "feat",
      "breakingChange",
      undefined,
      true,
    );

    const mappedCommitInfo: MappedCommit<CommitInfo>[] = [
      feature1,
      fix1,
      fix2,
      breakingChange,
      chore1,
    ];

    it("should extract changes from commit infos", async () => {
      const actual = await executeRx(
        mappedCommitInfo,
        $processChangesFromGitHistory(),
      );

      expect(actual).toEqual({
        major: [breakingChange],
        minor: [feature1],
        patch: [fix1, fix2],
      });
    });
  });
});
