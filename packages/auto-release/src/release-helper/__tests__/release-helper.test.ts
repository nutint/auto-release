import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLogConfig,
  extractReleaseInformation,
} from "@/release-helper/release-helper";
import * as CheckVersion from "../check-version";
import { MappedCommit } from "@/git/git-log";
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";
import { fail } from "node:assert";

describe("ReleaseHelper", () => {
  describe("extractReleaseInformation", () => {
    const mockedCheckCurrentVersion = vi.spyOn(CheckVersion, "checkVersion");

    const currentVersion = {
      packageVersion: "1.0.0",
      latestGitTag: "1.0.0",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedCheckCurrentVersion.mockResolvedValue(currentVersion);
    });

    it("should check current version", async () => {
      await extractReleaseInformation();

      expect(mockedCheckCurrentVersion).toHaveBeenCalledWith({});
    });

    it("should accept versionSource as parameter", async () => {
      const versionSourceConfiguration = { versionFile: "/abc/build.sbt" };
      await extractReleaseInformation(versionSourceConfiguration);

      expect(mockedCheckCurrentVersion).toHaveBeenCalledWith(
        versionSourceConfiguration,
      );
    });

    it("should return correct release information", async () => {
      const releaseInformation = await extractReleaseInformation();

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

  describe("createLogConfig", () => {
    it("should return predicate when provide scope", () => {
      const { predicate } = createLogConfig({ scope: "auto-release" });

      if (!predicate) {
        fail();
      }
      expect(
        predicate({
          mapped: { scope: "auto-release" },
        } as MappedCommit<ConventionalCommit>),
      ).toBeTruthy();
    });

    it("should not return predicate when not provide scope", () => {
      const { predicate } = createLogConfig();

      expect(predicate).toBeUndefined();
    });
  });
});
