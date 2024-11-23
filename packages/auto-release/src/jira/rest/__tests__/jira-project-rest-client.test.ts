import { describe, it, expect, beforeEach, vi } from "vitest";
import { JiraProjectRestClient } from "@/jira/rest/jira-project-rest-client";
import axios, { AxiosError } from "axios";
import { getUserAgent } from "@/jira/get-server.info";
import { JiraIssueOperationError } from "@/jira/jira-issue-models";
import { fail } from "node:assert";

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
    const actual = JiraProjectRestClient({
      key,
      id,
      config,
    });

    expect(actual.key).toEqual(key);
    expect(actual.id).toEqual(id);
    expect(actual.config).toEqual(config);
  });

  describe("getIssue", () => {
    const mockedAxiosGet = vi.spyOn(axios, "get");

    const issueKey = "SCRUM";
    const getProjectAxiosResponse = {
      data: {
        id: "12345",
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

    const { getIssue } = JiraProjectRestClient({
      key,
      id,
      config,
    });

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
          description: "description",
          released: false,
        },
      ]);
      expect(actual.id).toEqual("12345");
      expect(actual.status).toEqual("In Progress");
      expect(actual.issueType).toEqual("User Story");
    });
  });
});
