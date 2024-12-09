import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  $processJiraIssuesFromGitHistory,
  $processVersionFromGitHistory,
  processVersionFromGitHistory,
} from "@/release-helper/process-version-from-git-history";
import { MappedCommit } from "@/git/git-log";
import { executeRx } from "@/release-helper/test-helpers/helpers";
import * as GitHelper from "@/git/git-helper";
import { from } from "rxjs";
import { extractJiraIssue } from "@/release-helper/process-jira-issues-from-git-history";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";

describe("ProcessVersionFromGitHistory", () => {
  const createCommitV2 = (
    tags: string[],
    jiraIssue?: string,
    scope: string = "auto-release",
  ): MappedCommit<CommitInfo> => {
    const jiraIssueInMessage = jiraIssue === undefined ? "" : `${jiraIssue} `;
    const subject = `${jiraIssueInMessage} extract latest version tag`;
    const message = `feat(${scope}): ${subject}`;
    return {
      hash: `e79826ae076eb568c33e45f4cc2ca84db8b02e37${tags.join("")}`,
      author: "dev",
      date: "Mon Oct 28 21:47:07 2024 +0700",
      message,
      tags,
      mapped: {
        type: "feat",
        subject: subject,
        scope,
        breakingChange: false,
        jiraIssueId: jiraIssue,
      },
    };
  };

  const tagsWithNoJiraIssues = [
    "auto-release@1.0.0",
    "auto-release@1.0.1",
    "auto-release@1.0.1-beta",
    "0.1.0",
    "0.1.0-alpha",
    "0.1.0-beta",
    "Some-unrelated-tag",
  ];
  const tagsWithScum1 = ["1.0.2-beta"];
  const tagWithScrum2 = ["1.0.0", "1.0.1"];

  const scrum1V2Commits = tagsWithScum1.map((tag) =>
    createCommitV2([tag], "SCRUM-1"),
  );
  const scrum2V2Commits = tagWithScrum2.map((tag) =>
    createCommitV2([tag], "SCRUM-2"),
  );
  const commitV2WithNoJiraIssues = tagsWithNoJiraIssues.map((tag) =>
    createCommitV2([tag]),
  );
  const commitsV2: MappedCommit<CommitInfo>[] = [
    ...scrum1V2Commits,
    ...scrum2V2Commits,
    ...commitV2WithNoJiraIssues,
  ];

  const projectKey = "SCRUM";

  const expectedJiraIssuesV2 = [
    {
      issueId: "SCRUM-1",
      commits: scrum1V2Commits.map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
    },
    {
      issueId: "SCRUM-2",
      commits: scrum2V2Commits.map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
    },
    {
      commits: commitV2WithNoJiraIssues.map((commit) => ({
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
      mockedGetLogStream.mockReturnValue(from(commitsV2));
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

    it("should return empty jiraIssues when no project key specified", async () => {
      const actual = await processVersionFromGitHistory({});

      expect(actual.jiraIssues).toEqual([]);
    });

    it("should return jiraIssues", async () => {
      const actual = await processVersionFromGitHistory({
        jiraProjectKey: "SCRUM",
      });

      expect(actual.jiraIssues).toEqual(expectedJiraIssuesV2);
    });
  });

  describe("$processVersionFromGitHistory", () => {
    it("should process latest tags based on sorted tags", async () => {
      const actual = await executeRx(
        commitsV2,
        $processVersionFromGitHistory({ gitTagPrefix: "auto-release" }),
      );

      expect(actual).toEqual("auto-release@1.0.1");
    });
  });

  describe("$processJiraIssuesFromGitHistory", () => {
    it("should get Jira issues as array", async () => {
      const actual = await executeRx(
        commitsV2,
        $processJiraIssuesFromGitHistory(projectKey),
      );

      expect(actual).toEqual(expectedJiraIssuesV2);
    });
  });
});
