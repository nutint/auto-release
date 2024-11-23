import { describe, it, expect, vi, beforeEach } from "vitest";
import { JiraJsClientV3 } from "../jira-js-client-v3";
import { HttpException } from "jira.js";

describe("JiraJsClientV3", () => {
  const jiraJsClient = {
    projects: {
      getProject: vi.fn(),
    },
  } as any;
  const jiraJsClientV3 = JiraJsClientV3(jiraJsClient);
  const projectKey = "SCRUM";
  const jiraJsProjectResponse = { id: "1000", key: projectKey };

  describe("getProject", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      jiraJsClient.projects.getProject.mockResolvedValue(jiraJsProjectResponse);
    });

    it("should get project with projectKey", async () => {
      await jiraJsClientV3.getProject(projectKey);

      expect(jiraJsClient.projects.getProject).toHaveBeenCalledWith(projectKey);
    });

    it("should return undefined when project does not exists", async () => {
      jiraJsClient.projects.getProject.mockRejectedValue(
        new HttpException("Request failed with status code 404", 404),
      );
      const actual = await jiraJsClientV3.getProject(projectKey);

      expect(actual).toBeUndefined();
    });

    it("should throw error when non 404 error happen", async () => {
      jiraJsClient.projects.getProject.mockRejectedValue(
        new HttpException("Request failed with status code 500", 500),
      );

      await expect(() => jiraJsClientV3.getProject(projectKey)).rejects.toEqual(
        new Error("Get project failed"),
      );
    });

    it("should throw error when other exception thrown", async () => {
      jiraJsClient.projects.getProject.mockRejectedValue(
        new Error("Other exception"),
      );

      await expect(() => jiraJsClientV3.getProject(projectKey)).rejects.toEqual(
        new Error("Get project failed"),
      );
    });

    it("should return project info when project is exists", async () => {
      const actual = await jiraJsClientV3.getProject(projectKey);

      expect(actual?.id).toEqual(jiraJsProjectResponse.id);
      expect(actual?.key).toEqual(jiraJsProjectResponse.key);
      expect(actual?._client).toEqual(jiraJsClient);
    });
  });
});
