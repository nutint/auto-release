import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  JiraProjectClient,
  JiraProjectClientParams,
} from "@/jira/jira-project-client";
import { Version3Client } from "jira.js";

describe("JiraProjectClient", () => {
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
    jiraJsClient,
  } as unknown as JiraProjectClientParams<Version3Client>;
  const { createIssue, getIssue, createVersion, getVersions } =
    JiraProjectClient(jiraProjectClientInfo);

  const generatedIssueId = {
    id: "issueId",
    key: "issueKey",
  };

  describe("createIssue", () => {
    const issueInfo = {
      summary: "My testing issue",
      issueType: "Task",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.issues.createIssue.mockResolvedValue(generatedIssueId);
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

      expect(actual).toEqual({
        ...generatedIssueId,
        ...issueInfo,
      });
    });
  });

  describe("getIssue", () => {
    const createdIssue = {
      id: generatedIssueId.id,
      fields: {
        issuetype: {
          name: "Story",
        },
        summary: "Test",
      },
    };
    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.issues.getIssue.mockResolvedValue(createdIssue);
    });

    it("should get issue by key", async () => {
      await getIssue(generatedIssueId.key);

      expect(jiraJsClient.issues.getIssue).toHaveBeenCalledWith({
        issueIdOrKey: generatedIssueId.key,
      });
    });

    it("should return mapped fields", async () => {
      const actual = await getIssue(generatedIssueId.key);

      expect(actual).toEqual({
        key: generatedIssueId.key,
        id: generatedIssueId.id,
        issueType: createdIssue.fields.issuetype.name,
        summary: createdIssue.fields.summary,
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

    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.projectVersions.createVersion.mockResolvedValue({
        self: versionUrl,
        id: versionId,
        description,
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

      expect(createdVersion).toEqual({
        url: versionUrl,
        id: versionId,
        description,
        name: input.name,
      });

      expect(createdVersion.name).toEqual(input.name);
      expect(createdVersion.url).toEqual(versionUrl);
      expect(createdVersion.id).toEqual(versionId);
      expect(createdVersion.description).toEqual(description);
    });

    describe("getVersions", () => {
      const jiraVersion = {
        name: "name",
        self: "self",
        id: "id",
        description: "description",
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
        expect(actual[0]!.url).toEqual("self");
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
