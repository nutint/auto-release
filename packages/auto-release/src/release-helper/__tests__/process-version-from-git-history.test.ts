import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  $processVersionFromGitHistory,
  processVersionFromGitHistory,
} from "@/release-helper/process-version-from-git-history";
import { MappedCommit } from "@/git/git-log";
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";
import { executeRx } from "@/release-helper/test-helpers/helpers";
import * as GitHelper from "@/git/git-helper";
import { from } from "rxjs";

describe("ProcessVersionFromGitHistory", () => {
  const createCommit = (
    tags: string[],
    scope: string = "auto-release",
  ): MappedCommit<ConventionalCommit> => ({
    hash: `e79826ae076eb568c33e45f4cc2ca84db8b02e37${tags.join("")}`,
    author: "dev",
    date: "Mon Oct 28 21:47:07 2024 +0700",
    message: `feat(${scope}): extract latest version tag`,
    tags,
    mapped: { header: "", notes: [], type: "feat", subject: "" },
  });

  const commits: MappedCommit<ConventionalCommit>[] = [
    createCommit(["1.0.2-beta"]),
    createCommit(["1.0.0"]),
    createCommit(["1.0.1"]),
    createCommit(["auto-release@1.0.0"]),
    createCommit(["auto-release@1.0.1"]),
    createCommit(["auto-release@1.0.1-beta"]),
    createCommit(["0.1.0"]),
    createCommit(["0.1.0-alpha"]),
    createCommit(["0.1.0-beta"]),
    createCommit(["Some-unrelated-tag"]),
  ];

  describe("processVersionFromGitHistory", () => {
    const mockedGitHelper = vi.spyOn(GitHelper, "gitHelper");
    const mockedGetLogStream = vi.fn();

    const scope = "auto-release";

    beforeEach(() => {
      vi.clearAllMocks();
      mockedGitHelper.mockReturnValue({
        getLogs: vi.fn(),
        getLogStream: mockedGetLogStream,
      });
      mockedGetLogStream.mockReturnValue(from(commits));
    });

    it("should init gitHelper", async () => {
      await processVersionFromGitHistory({ scope });

      expect(mockedGitHelper).toHaveBeenCalled();
    });

    it("should getLogStream", async () => {
      await processVersionFromGitHistory({ scope });

      expect(mockedGetLogStream).toHaveBeenCalled();
    });

    it("should return latest tag when has latest stable tags", async () => {
      const actual = await processVersionFromGitHistory({});

      expect(actual).toEqual("1.0.1");
    });
  });

  describe("$processVersionFromGitHistory", () => {
    it("should process latest tags based on sorted tags", async () => {
      const actual = await executeRx(
        commits,
        $processVersionFromGitHistory({ gitTagPrefix: "auto-release" }),
      );

      expect(actual).toEqual("auto-release@1.0.1");
    });
  });
});
