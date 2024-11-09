import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLogConfig,
  extractReleaseInformation,
  printReleaseInformation,
  ReleaseInformation,
} from "@/release-helper/release-helper";
import * as CheckVersion from "../process-version-from-version-file";
import * as ProcessVersionFromGitHistory from "../process-version-from-git-history";
import { MappedCommit } from "@/git/git-log";
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";
import { fail } from "node:assert";

describe("ReleaseHelper", () => {
  describe("extractReleaseInformation", () => {
    const mockedCheckCurrentVersion = vi.spyOn(
      CheckVersion,
      "processVersionFromVersionFile",
    );
    const mockedProcessVersionFromGitHistory = vi.spyOn(
      ProcessVersionFromGitHistory,
      "processVersionFromGitHistory",
    );

    const latestGitTag = "1.0.0";
    const packageVersion = "1.0.0";
    const versionSourceConfiguration = {
      gitTagPrefix: "auto-release",
      scope: "auto-release",
      jiraProjectKey: "SCRUM",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedCheckCurrentVersion.mockResolvedValue(packageVersion);
      mockedProcessVersionFromGitHistory.mockResolvedValue({
        latestGitTag,
        jiraIssues: [],
      });
    });

    it("should processVersionFromGitHistory with gitTagPrefix and Scope and ProjectKey from versionSourceConfiguration", async () => {
      await extractReleaseInformation(versionSourceConfiguration);

      expect(mockedProcessVersionFromGitHistory).toHaveBeenCalledWith(
        versionSourceConfiguration,
      );
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

    it("should return release information with jira attribute as undefined when no jiraProjectKey", async () => {
      const releaseInformation = await extractReleaseInformation();

      expect(releaseInformation).toEqual({
        currentVersion: packageVersion,
        latestTagVersion: latestGitTag,
        nextVersion: "1.0.1",
        changes: {
          minor: [],
          major: [],
          patch: [],
        },
        jira: undefined,
      });
    });

    it("should return correct release information with jira attribute when has jiraProjectKey", async () => {
      const releaseInformation = await extractReleaseInformation(
        versionSourceConfiguration,
      );

      expect(releaseInformation).toEqual({
        currentVersion: packageVersion,
        latestTagVersion: latestGitTag,
        nextVersion: "1.0.1",
        changes: {
          minor: [],
          major: [],
          patch: [],
        },
        jira: {
          issues: [],
          projectKey: versionSourceConfiguration.jiraProjectKey,
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

  describe("printReleaseInformation", () => {
    const releaseInformation: ReleaseInformation = {
      currentVersion: "0.0.0",
      latestTagVersion: undefined,
      nextVersion: "0.0.1",
      changes: {
        minor: [],
        major: [],
        patch: [],
      },
    };

    const mockedConsoleLog = vi.spyOn(console, "log");

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should print release information as Json when output format as Json", () => {
      printReleaseInformation(releaseInformation, "json");

      expect(mockedConsoleLog).toHaveBeenCalledWith(
        JSON.stringify(releaseInformation),
      );
    });

    it("should print release information as Text when output format as Text", () => {
      printReleaseInformation(releaseInformation, "text");

      const message = [
        "Release Information:",
        `  Current version: ${releaseInformation.currentVersion}`,
        `  Latest tagged version: none`,
        `  Next version: ${releaseInformation.nextVersion}`,
      ].join("\n");
      expect(mockedConsoleLog).toHaveBeenCalledWith(message);
    });

    it("should make latest tag version as version number when latestTagVersion is presented", () => {
      printReleaseInformation(
        {
          ...releaseInformation,
          latestTagVersion: "1.0.1",
        },
        "text",
      );

      const message = [
        "Release Information:",
        `  Current version: ${releaseInformation.currentVersion}`,
        `  Latest tagged version: 1.0.1`,
        `  Next version: ${releaseInformation.nextVersion}`,
      ].join("\n");
      expect(mockedConsoleLog).toHaveBeenCalledWith(message);
    });
  });
});
