import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  JiraJsProjectClientV3,
  mapToJiraIssueModel,
} from "@/jira/jira-js-v3/jira-js-project-client-v3";
import { HttpException, Version3Client } from "jira.js";
import { JiraProjectClientParams } from "@/jira/jira-project-client";
import { JiraIssueOperationError } from "@/jira/jira-issue-models";

describe("JiraJsProjectClientV3", () => {
  const jiraJsClient = {
    issues: {
      createIssue: vi.fn(),
      getIssue: vi.fn(),
    },
    projectVersions: {
      createVersion: vi.fn(),
      getProjectVersions: vi.fn(),
    },
  };

  const jiraProjectClientInfo = {
    key: "PROJKEY",
    id: "1234",
    config: jiraJsClient,
  } as unknown as JiraProjectClientParams<Version3Client>;
  const { createIssue, getIssue, createVersion, getVersions } =
    JiraJsProjectClientV3(jiraProjectClientInfo);

  const generatedIssueId = {
    id: "issueId",
    key: "issueKey",
  };

  const createdIssue = {
    ...generatedIssueId,
    fields: {
      issuetype: {
        name: "Story",
      },
      summary: "Test",
      fixVersions: [
        {
          id: "23456",
          name: "1.0.1",
          released: false,
          description: "description",
        },
      ],
      status: {
        name: "In Progress",
      },
    },
  };

  describe("createIssue", () => {
    const issueInfo = {
      summary: "My testing issue",
      issueType: "Task",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.issues.createIssue.mockResolvedValue(createdIssue);
    });

    it("should create issue with correct client parameter", async () => {
      await createIssue(issueInfo);

      expect(jiraJsClient.issues.createIssue).toHaveBeenCalledWith({
        fields: {
          summary: issueInfo.summary,
          issuetype: {
            name: issueInfo.issueType,
          },
          project: {
            key: jiraProjectClientInfo.key,
          },
        },
      });
    });

    it("should return issue id and issue key after created", async () => {
      const actual = await createIssue(issueInfo);

      expect(actual).toEqual(mapToJiraIssueModel(createdIssue));
    });
  });

  describe("getIssue", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.issues.getIssue.mockResolvedValue(createdIssue);
    });

    it("should get issue by key", async () => {
      await getIssue(createdIssue.key);

      expect(jiraJsClient.issues.getIssue).toHaveBeenCalledWith({
        issueIdOrKey: createdIssue.key,
      });
    });

    it("should return undefined when get issue throw not found error", async () => {
      jiraJsClient.issues.getIssue.mockRejectedValue(
        new HttpException("any", 404),
      );

      const actual = await getIssue(createdIssue.key);

      expect(actual).toBeUndefined();
    });

    it("should throw JiraIssueOperation error when other http exception happen", async () => {
      jiraJsClient.issues.getIssue.mockRejectedValue(
        new HttpException("Server error", 500),
      );

      await expect(() => getIssue(createdIssue.key)).rejects.toEqual(
        new JiraIssueOperationError("Server error"),
      );
    });

    it("should throw JiraIssueOperation error with Jira response incompatible when found issue's schema incorrect", async () => {
      jiraJsClient.issues.getIssue.mockResolvedValue({
        ...createdIssue,
        id: undefined,
      });

      await expect(() => getIssue(createdIssue.key)).rejects.toEqual(
        new JiraIssueOperationError("Jira response incompatible"),
      );
    });

    it("should return other error when uncategorized error happen", async () => {
      jiraJsClient.issues.getIssue.mockRejectedValue(new Error("Other error"));

      await expect(() => getIssue(createdIssue.key)).rejects.toEqual(
        new JiraIssueOperationError("Error: Other error"),
      );
    });

    it("should return mapped fields", async () => {
      const actual = await getIssue(createdIssue.key);

      expect(actual).toEqual({
        key: createdIssue.key,
        id: createdIssue.id,
        summary: createdIssue.fields.summary,
        fixVersions: createdIssue.fields.fixVersions.map((version) => ({
          id: version.id,
          name: version.name,
          description: version.description,
          released: version.released,
        })),
        status: createdIssue.fields.status.name,
        issueType: createdIssue.fields.issuetype.name,
      });
    });
  });

  describe("createVersion", () => {
    const versionName = "1.0.0";
    const input = {
      name: versionName,
    };

    const versionUrl = "https://abc.atlassian.com/versions?id=xxx";
    const versionId = "123456";
    const description = "nothing";
    const released = false;

    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.projectVersions.createVersion.mockResolvedValue({
        self: versionUrl,
        id: versionId,
        description,
        released,
      });
    });

    it("should create version", async () => {
      await createVersion(input);

      expect(jiraJsClient.projectVersions.createVersion).toHaveBeenCalledWith({
        name: versionName,
        projectId: parseInt(jiraProjectClientInfo.id),
      });
    });

    it("should return version information", async () => {
      const createdVersion = await createVersion(input);

      expect(createdVersion.name).toEqual(input.name);
      expect(createdVersion.released).toEqual(released);
      expect(createdVersion.id).toEqual(versionId);
      expect(createdVersion.description).toEqual(description);
    });

    describe("getVersions", () => {
      const jiraVersion = {
        name: "name",
        self: "self",
        id: "id",
        description: "description",
        released: false,
      };
      const jiraJsResponse = [jiraVersion];

      beforeEach(() => {
        vi.clearAllMocks();
        jiraJsClient.projectVersions.getProjectVersions.mockResolvedValue(
          jiraJsResponse,
        );
      });

      it("should get version", async () => {
        await getVersions();

        expect(
          jiraJsClient.projectVersions.getProjectVersions,
        ).toHaveBeenCalledWith({
          projectIdOrKey: jiraProjectClientInfo.key,
        });
      });

      it("should response mapped object", async () => {
        const actual = await getVersions();

        expect(actual[0]!.name).toEqual("name");
        expect(actual[0]!.released).toEqual(false);
        expect(actual[0]!.id).toEqual("id");
        expect(actual[0]!.description).toEqual("description");
      });

      it("should response name as empty string if version name is undefined", async () => {
        jiraJsClient.projectVersions.getProjectVersions.mockResolvedValue([
          { ...jiraVersion, name: undefined },
        ]);

        const actual = await getVersions();

        expect(actual[0]!.name).toEqual("");
      });
    });
  });
});
