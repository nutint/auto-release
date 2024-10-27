import { beforeEach, describe, expect, it, vi } from "vitest";
import { extractReleaseInformation } from "@/release-helper/release-helper";
import * as CheckVersion from "../check-version";

describe("ReleaseHelper", () => {
  describe("extractReleaseInformation", () => {
    const mockedCheckCurrentVersion = vi.spyOn(CheckVersion, "checkVersion");

    const currentVersion = {
      packageVersion: "1.0.0",
      latestGitTag: "1.0.0",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedCheckCurrentVersion.mockReturnValue(currentVersion);
    });

    it("should check current version", () => {
      extractReleaseInformation();

      expect(mockedCheckCurrentVersion).toHaveBeenCalled();
    });

    it("should return correct release information", () => {
      const releaseInformation = extractReleaseInformation();

      expect(releaseInformation).toEqual({
        currentVersion: currentVersion.packageVersion,
        latestTagVersion: currentVersion.latestGitTag,
        nextVersion: "1.0.1",
        changes: {
          minor: [],
          major: [],
          patch: [],
        },
        jira: {
          tickets: ["SCRUM-1", "SCRUM-2"],
          projectKey: "SCRUM",
        },
      });
    });
  });
});
