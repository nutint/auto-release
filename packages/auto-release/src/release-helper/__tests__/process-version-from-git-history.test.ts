import { beforeEach, describe, expect, it, vi } from "vitest";
import * as GetVersionInfoFromGitHistory from "@/release-helper/version-helper/get-version-info-from-git-history";
import { processVersionFromGitHistory } from "@/release-helper/process-version-from-git-history";

describe("ProcessVersionFromGitHistory", () => {
  describe("processVersionFromGitHistory", () => {
    const mockedGetVersionInfoFromGitHistory = vi.spyOn(
      GetVersionInfoFromGitHistory,
      "getVersionInfoFromGitHistory",
    );
    const latestGitTag = "1.0.1";
    const versionInfoFromGitHistory = {
      latestTags: ["1.0-1-beta"],
      latestStableTags: [latestGitTag],
    };

    const gitTagPrefixAndScope = {
      gitTagPrefix: "auto-release",
      scope: "auto-release",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedGetVersionInfoFromGitHistory.mockResolvedValue(
        versionInfoFromGitHistory,
      );
    });

    it("should get version info from git history", async () => {
      await processVersionFromGitHistory(gitTagPrefixAndScope);

      expect(mockedGetVersionInfoFromGitHistory).toHaveBeenCalledWith(
        gitTagPrefixAndScope,
      );
    });

    it("should return latestStableTag when contains at least one latestStableTags", async () => {
      const actual = await processVersionFromGitHistory(gitTagPrefixAndScope);

      expect(actual).toEqual(latestGitTag);
    });

    it("should return undefined when latestStableTags is empty", async () => {
      mockedGetVersionInfoFromGitHistory.mockResolvedValue({
        ...versionInfoFromGitHistory,
        latestStableTags: [],
      });
      const actual = await processVersionFromGitHistory(gitTagPrefixAndScope);

      expect(actual).toBeUndefined();
    });
  });
});
