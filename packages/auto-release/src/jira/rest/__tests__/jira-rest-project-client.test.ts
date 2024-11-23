import { describe, it, expect, beforeEach, vi } from "vitest";
import { JiraRestProjectClient } from "@/jira/rest/jira-rest-project-client";
import axios, { AxiosError } from "axios";
import { getUserAgent } from "@/jira/get-server.info";
import { JiraIssueOperationError } from "@/jira/jira-issue-models";
import { fail } from "node:assert";
import { JiraVersionOperationError } from "@/jira/jira-version-models";

describe("JiraProjectRestClient", () => {
  const key = "SCRUM";
  const id = "id";
  const config = {
    host: "https://jira.domain.com",
    axiosRequestConfig: {
      headers: {
        Authorization: "authorization",
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      },
    },
  };

  it("should return key, id, and config", () => {
    const actual = JiraRestProjectClient({
      key,
      id,
      config,
    });

    expect(actual.key).toEqual(key);
    expect(actual.id).toEqual(id);
    expect(actual.config).toEqual(config);
  });

  const { getIssue, createIssue, createVersion, getVersions } =
    JiraRestProjectClient({
      key,
      id,
      config,
    });

  describe("getIssue", () => {
    const mockedAxiosGet = vi.spyOn(axios, "get");

    const issueKey = "SCRUM";
    const getProjectAxiosResponse = {
      data: {
        id: "12345",
        key: "SCRUM-1",
        fields: {
          summary: "This is summary",
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
          issuetype: {
            name: "User Story",
          },
        },
      },
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosGet.mockResolvedValue(getProjectAxiosResponse);
    });

    it("should get with correct request", async () => {
      await getIssue(issueKey);

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        `${config.host}/rest/api/2/issue/${issueKey}`,
        config.axiosRequestConfig,
      );
    });

    it("should return undefined when issue not found", async () => {
      mockedAxiosGet.mockRejectedValue(new AxiosError("Not found", "404"));

      const actual = await getIssue(issueKey);

      expect(actual).toBeUndefined();
    });

    it("should return response incompatible error when schema validation failed", async () => {
      mockedAxiosGet.mockResolvedValue({
        ...getProjectAxiosResponse,
        data: { foo: "bar" },
      });

      await expect(() => getIssue(issueKey)).rejects.toEqual(
        new JiraIssueOperationError("Jira response incompatible"),
      );
    });

    it("should throw error when server error", async () => {
      mockedAxiosGet.mockRejectedValue(new AxiosError("Other error", "500"));

      await expect(() => getIssue(issueKey)).rejects.toEqual(
        new JiraIssueOperationError("Other error"),
      );
    });

    it("should throw error when other error happen", async () => {
      mockedAxiosGet.mockRejectedValue(new Error("abc"));

      await expect(() => getIssue(issueKey)).rejects.toEqual(
        new JiraIssueOperationError("Error: abc"),
      );
    });

    it("should return issue with got response", async () => {
      const actual = await getIssue(issueKey);

      if (actual === undefined) {
        fail();
      }

      expect(actual.key).toEqual(issueKey);
      expect(actual.summary).toEqual("This is summary");
      expect(actual.fixVersions).toEqual([
        {
          id: "23456",
          name: "1.0.1",
          projectKey: "SCRUM",
          description: "description",
          released: false,
        },
      ]);
      expect(actual.id).toEqual("12345");
      expect(actual.status).toEqual("In Progress");
      expect(actual.issueType).toEqual("User Story");
    });
  });

  describe("createIssue", () => {
    it("should throw JiraIssueOperationError when unimplemented", async () => {
      await expect(() =>
        createIssue({
          summary: "Summary",
          issueType: "User Story",
          description: "",
        }),
      ).rejects.toEqual(new JiraIssueOperationError("unimplemented"));
    });
  });

  describe("createVersion", () => {
    const mockedAxiosPost = vi.spyOn(axios, "post");
    const name = "1.0.1";
    const versionId = "versionId";
    const versionDataResponse = {
      name,
      id: versionId,
      description: "description",
      released: true,
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosPost.mockResolvedValue({
        data: versionDataResponse,
      });
    });

    it("should create version with correct request", async () => {
      await createVersion({ name });

      expect(mockedAxiosPost).toHaveBeenCalledWith(
        `${config.host}/rest/api/2/version`,
        {
          project: key,
          name,
        },
        config.axiosRequestConfig,
      );
    });

    it("should throw error when version is incompatible", async () => {
      mockedAxiosPost.mockResolvedValue({
        data: {
          foo: "bar",
        },
      });

      await expect(() => createVersion({ name })).rejects.toEqual(
        new JiraVersionOperationError("Jira response incompatible"),
      );
    });
    it("should throw error when other error happen", async () => {
      mockedAxiosPost.mockRejectedValue(new Error("abc"));

      await expect(() => createVersion({ name })).rejects.toEqual(
        new JiraVersionOperationError("Error: abc"),
      );
    });

    it("should return version properties", async () => {
      const actual = await createVersion({ name });

      expect(actual.id).toEqual(versionId);
      expect(actual.name).toEqual(name);
      expect(actual.description).toEqual(versionDataResponse.description);
      expect(actual.released).toEqual(versionDataResponse.released);
      expect(actual.config).toEqual(config);
    });
  });

  describe("getVersions", () => {
    const mockedAxiosGet = vi.spyOn(axios, "get");

    const version = {
      id: "12345",
      name: "1.0.1",
      description: "description",
      released: true,
    };
    const versions = [version];

    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosGet.mockResolvedValue({
        data: versions,
      });
    });

    it("should get versions with correct request", async () => {
      await getVersions();

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        `${config.host}/rest/projects/1.0/project/${key}/release/allversions-nodetails`,
        config.axiosRequestConfig,
      );
    });

    it("should throw error when version is incompatible", async () => {
      mockedAxiosGet.mockResolvedValue({
        data: [{ foo: "bar" }],
      });

      await expect(() => getVersions()).rejects.toEqual(
        new JiraVersionOperationError("Jira response incompatible"),
      );
    });

    it("should throw error when other error happen", async () => {
      const error = new Error("abc");
      mockedAxiosGet.mockRejectedValue(error);

      await expect(() => getVersions()).rejects.toEqual(
        new JiraVersionOperationError(error as unknown as string),
      );
    });

    it("should return versions", async () => {
      const [actual] = await getVersions();

      if (actual === undefined) {
        fail();
      }

      expect(actual.id).toEqual(version.id);
      expect(actual.name).toEqual(version.name);
      expect(actual.description).toEqual(version.description);
      expect(actual.released).toEqual(version.released);
      expect(actual.config).toEqual(config);
    });
  });
});
