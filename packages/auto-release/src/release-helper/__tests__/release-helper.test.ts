import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLogConfig,
  extractReleaseInformation,
  printReleaseInformation,
  ReleaseInformation,
} from "@/release-helper/release-helper";
import * as CheckVersion from "../process-version-from-version-file";
import * as ProcessVersionFromGitHistory from "../process-version-from-git-history";
import * as CustomFormatParser from "@/custom-commit-parser/custom-format-parser";
import * as ExtractCommitInfo from "@/release-helper/commit-info/extract-commit-info";
import { MappedCommit } from "@/git/git-log";
import { fail } from "node:assert";
import { Extract } from "@/custom-commit-parser/custom-format-parser";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";
import * as FormatSyntaxParser from "@/custom-commit-parser/format-syntax-parser";
import { FormatElement } from "@/custom-commit-parser/format-syntax-parser";

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
        changes: {
          major: [],
          minor: [],
          patch: [],
        },
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
    it("should return predicate that filter scope correctly when provide scope", () => {
      const { predicate } = createLogConfig({ scope: "auto-release" });

      if (!predicate) {
        fail();
      }

      expect(
        predicate({
          mapped: {
            type: "feat",
            subject: "subject",
            scope: "auto-release",
            breakingChange: false,
          },
        } as unknown as MappedCommit<CommitInfo>),
      ).toBeTruthy();

      expect(
        predicate({
          mapped: {
            type: "feat",
            subject: "subject",
            scope: "other",
            breakingChange: false,
          },
        } as unknown as MappedCommit<CommitInfo>),
      ).toBeFalsy();
    });

    it("should not return predicate with not provide scope", () => {
      const { predicate } = createLogConfig();

      expect(predicate).toBeUndefined();
    });

    describe("mapper", () => {
      const mockedCustomFormatParser = vi.spyOn(
        CustomFormatParser,
        "customFormatParser",
      );
      const mockedExtractCommitInfo = vi.spyOn(
        ExtractCommitInfo,
        "extractCommitInfo",
      );
      const mockedFormatSyntaxParser = vi.spyOn(
        FormatSyntaxParser,
        "formatSyntaxParser",
      );

      const commitMessage = "test commit message";
      const formatElements = [{ foo: "bar" }] as unknown as FormatElement[];
      const extracts: Extract[] = [];
      const extractedCommitInfo = {
        type: "feat",
        subject: "subject",
        scope: "auto-release",
        breakingChange: false,
        jiraIssueId: "ABC-123",
      };

      beforeEach(() => {
        vi.clearAllMocks();
        mockedFormatSyntaxParser.mockReturnValue(formatElements);
        mockedCustomFormatParser.mockReturnValue(extracts);
        mockedExtractCommitInfo.mockReturnValue(extractedCommitInfo);
      });

      it("should should call custom format parser with default format when create log config with no commit format provided", () => {
        const { mapper } = createLogConfig();

        mapper(commitMessage);

        expect(mockedCustomFormatParser).toHaveBeenCalledWith(
          formatElements,
          commitMessage,
        );
      });

      it("should use commit format from parameter when passing commit format", () => {
        const commitFormat = "{{commitFormat}}";
        const { mapper } = createLogConfig({ commitFormat });

        mapper(commitMessage);

        expect(mockedCustomFormatParser).toHaveBeenCalledWith(
          formatElements,
          commitMessage,
        );
      });

      it("should extract commit info with result from format parser", () => {
        const { mapper } = createLogConfig();

        mapper(commitMessage);

        expect(mockedExtractCommitInfo).toHaveBeenCalledWith(extracts);
      });

      it("should return extracted commit info", () => {
        const { mapper } = createLogConfig();

        const actual = mapper(commitMessage);

        expect(actual).toEqual(extractedCommitInfo);
      });
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
