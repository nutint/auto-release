import { describe, it, expect, vi, beforeEach } from "vitest";
import { JiraJsVersionClientV3 } from "@/jira/jira-js-v3/jira-js-version-client-v3";
import { HttpException, Version3Client } from "jira.js";
import { JiraVersion } from "@/jira/jira-version-models";

describe("JiraJsVersionClientV3", () => {
  const jiraJsClient = {
    projectVersions: {
      updateVersion: vi.fn(),
      deleteAndReplaceVersion: vi.fn(),
    },
    issues: {
      getIssue: vi.fn(),
      editIssue: vi.fn(),
    },
  };

  const jiraVersionWithClient = {
    id: "id",
    name: "1.0.0",
    url: "url",
    description: "description",
    _client: jiraJsClient,
  } as unknown as JiraVersion & { _client: Version3Client };

  const {
    setRelease,
    delete: deleteVersion,
    tagIssuesFixVersion,
  } = JiraJsVersionClientV3(jiraVersionWithClient);

  describe("setRelease", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.projectVersions.updateVersion.mockResolvedValue({});
    });

    it("should update version with release value and version id", async () => {
      await setRelease(true);

      expect(jiraJsClient.projectVersions.updateVersion).toHaveBeenCalledWith({
        id: jiraVersionWithClient.id,
        released: true,
      });
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.projectVersions.deleteAndReplaceVersion.mockResolvedValue(
        {},
      );
    });

    it("should deleteAndReplaceVersion correctly", async () => {
      await deleteVersion();

      expect(
        jiraJsClient.projectVersions.deleteAndReplaceVersion,
      ).toHaveBeenCalledWith({
        id: jiraVersionWithClient.id,
      });
    });
  });

  describe("tagIssuesFixVersion", () => {
    const issueId = "SCRUM-1";

    const jiraIssue = {
      fields: {
        fixVersions: [{ id: "otherId" }],
      },
    };

    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.issues.getIssue.mockResolvedValue(jiraIssue);
      jiraJsClient.issues.editIssue.mockResolvedValue({});
    });

    it("should get issue with the project key", async () => {
      await tagIssuesFixVersion([issueId]);

      expect(jiraJsClient.issues.getIssue).toHaveBeenCalledWith({
        issueIdOrKey: issueId,
      });
    });

    it("should return result as unchanged if the issue already has that fix version", async () => {
      jiraJsClient.issues.getIssue.mockResolvedValue({
        ...jiraIssue,
        fields: {
          fixVersions: [{ id: jiraVersionWithClient.id }],
        },
      });

      const actual = await tagIssuesFixVersion([issueId]);

      expect(actual).toEqual([{ issueId, result: "unchanged" }]);
    });

    it("should edit issue when issue does not have fix version", async () => {
      await tagIssuesFixVersion([issueId]);

      expect(jiraJsClient.issues.editIssue).toHaveBeenCalledWith({
        issueIdOrKey: issueId,
        fields: {
          fixVersions: [{ id: "otherId" }, { id: jiraVersionWithClient.id }],
        },
      });
    });

    it("should return result as success when issues does not have fix version together", async () => {
      const actual = await tagIssuesFixVersion([issueId]);

      expect(actual).toEqual([{ issueId, result: "success" }]);
    });

    it("should return result with failed and reason when edit issue failed with HttpException", async () => {
      jiraJsClient.issues.editIssue.mockRejectedValue(
        new HttpException("reason"),
      );

      const actual = await tagIssuesFixVersion([issueId]);

      expect(actual).toEqual([{ issueId, result: "failed", reason: "reason" }]);
    });

    it("should return result with failed and no reason when edit issue failed with other error", async () => {
      jiraJsClient.issues.editIssue.mockRejectedValue(
        new Error("other reason"),
      );

      const actual = await tagIssuesFixVersion([issueId]);

      expect(actual).toEqual([{ issueId, result: "failed" }]);
    });
  });
});
