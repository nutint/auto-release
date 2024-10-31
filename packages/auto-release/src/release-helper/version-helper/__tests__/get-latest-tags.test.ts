import { beforeEach, describe, it, vi, expect } from "vitest";
import * as GitHelper from "@/git/git-helper";
import { MappedCommit } from "@/git/git-log";
import { from } from "rxjs";
import { getVersionInfoFromGitHistory } from "../get-version-info-from-git-history";

describe("getVersionInfoFromGitHistory", () => {
  const mockedGitHelper = vi.spyOn(GitHelper, "gitHelper");
  const mockedGitLogStream = vi.fn();

  const createCommit = (tags: string[], scope: string = "auto-release") => ({
    hash: `e79826ae076eb568c33e45f4cc2ca84db8b02e37${tags.join("")}`,
    author: "dev",
    date: "Mon Oct 28 21:47:07 2024 +0700",
    message: `feat(${scope}): extract latest version tag`,
    tags,
    mapped: "test",
  });

  const commits: MappedCommit<string>[] = [
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGitHelper.mockReturnValue({
      getLogs: vi.fn(),
      getLogStream: mockedGitLogStream,
    });
    mockedGitLogStream.mockReturnValue(from(commits));
  });

  it("should return latest tags correctly", async () => {
    const actual = await getVersionInfoFromGitHistory({
      scope: "auto-release",
    });

    expect(actual).toEqual({
      latestTags: [
        "0.1.0-alpha",
        "0.1.0-beta",
        "0.1.0",
        "1.0.0",
        "1.0.1",
        "1.0.2-beta",
      ],
      latestStableTags: ["0.1.0", "1.0.0", "1.0.1"],
    });
  });

  it("should support gitTagPrefix", async () => {
    const actual = await getVersionInfoFromGitHistory({
      gitTagPrefix: "auto-release",
    });

    expect(actual).toEqual({
      latestTags: [
        "auto-release@1.0.0",
        "auto-release@1.0.1-beta",
        "auto-release@1.0.1",
      ],
      latestStableTags: ["auto-release@1.0.0", "auto-release@1.0.1"],
    });
  });
});
