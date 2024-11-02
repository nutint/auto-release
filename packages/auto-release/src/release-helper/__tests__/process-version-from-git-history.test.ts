import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  $processJiraIssuesFromGitHistory,
  $processVersionFromGitHistory,
  processVersionFromGitHistory,
} from "@/release-helper/process-version-from-git-history";
import { MappedCommit } from "@/git/git-log";
import {
  ConventionalCommit,
  parseConventionalMessage,
} from "@/conventional-commit-helper/conventional-commit-helper";
import { executeRx } from "@/release-helper/test-helpers/helpers";
import * as GitHelper from "@/git/git-helper";
import { from } from "rxjs";
import { extractJiraIssue } from "@/release-helper/process-jira-issues-from-git-history";

describe("ProcessVersionFromGitHistory", () => {
  const createCommit = (
    tags: string[],
    jiraIssue?: string,
    scope: string = "auto-release",
  ): MappedCommit<ConventionalCommit> => {
    const jiraIssueInMessage = jiraIssue === undefined ? "" : `${jiraIssue} `;
    const message = `feat(${scope}): ${jiraIssueInMessage} extract latest version tag`;
    return {
      hash: `e79826ae076eb568c33e45f4cc2ca84db8b02e37${tags.join("")}`,
      author: "dev",
      date: "Mon Oct 28 21:47:07 2024 +0700",
      message,
      tags,
      mapped: parseConventionalMessage(message),
    };
  };

  const commitsWithNoJiraIssues: MappedCommit<ConventionalCommit>[] = [
    createCommit(["auto-release@1.0.0"]),
    createCommit(["auto-release@1.0.1"]),
    createCommit(["auto-release@1.0.1-beta"]),
    createCommit(["0.1.0"]),
    createCommit(["0.1.0-alpha"]),
    createCommit(["0.1.0-beta"]),
    createCommit(["Some-unrelated-tag"]),
  ];

  const scrum1Commits: MappedCommit<ConventionalCommit>[] = [
    createCommit(["1.0.2-beta"], "SCRUM-1"),
  ];

  const scrum2Commits: MappedCommit<ConventionalCommit>[] = [
    createCommit(["1.0.0"], "SCRUM-2"),
    createCommit(["1.0.1"], "SCRUM-2"),
  ];

  const commits: MappedCommit<ConventionalCommit>[] = [
    ...scrum1Commits,
    ...scrum2Commits,
    ...commitsWithNoJiraIssues,
  ];

  const projectKey = "SCRUM";
  const expectedJiraIssues = [
    {
      issueId: "SCRUM-1",
      commits: scrum1Commits.map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
    },
    {
      issueId: "SCRUM-2",
      commits: scrum2Commits.map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
    },
    {
      commits: commitsWithNoJiraIssues.map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
    },
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

      expect(actual.latestGitTag).toEqual("1.0.1");
    });

    it("should return jiraIssues", async () => {
      const actual = await processVersionFromGitHistory({});

      expect(actual.jiraIssues).toEqual(expectedJiraIssues);
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

  describe("$processJiraIssuesFromGitHistory", () => {
    it("should get Jira issues as array", async () => {
      const actual = await executeRx(
        commits,
        $processJiraIssuesFromGitHistory(projectKey),
      );

      expect(actual).toEqual(expectedJiraIssues);
    });
  });
});
