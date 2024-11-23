import { beforeEach, describe, expect, it, vi } from "vitest";
import { JiraJsClientV3 } from "../jira-js-client-v3";
import * as JiraJs from "jira.js";
import { HttpException, Version3Client } from "jira.js";
import { JiraConfiguration } from "@/jira/jira-configuration";

describe("JiraJsClientV3", () => {
  const mockedCreateVersion3Client = vi.spyOn(JiraJs, "Version3Client");
  const configuration: JiraConfiguration = {
    host: "https://abc.domain.com",
    authentication: {
      personalAccessToken: "PAT",
    },
  };

  const version3Client = {
    projects: {
      getProject: vi.fn(),
    },
  } as any;
  const projectKey = "SCRUM";
  const jiraJsProjectResponse = { id: "1000", key: projectKey };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCreateVersion3Client.mockReturnValue(
      version3Client as unknown as Version3Client,
    );
  });

  it("should create Version3Client with personalAccessToken when authentication has personal access token", () => {
    JiraJsClientV3(configuration);

    expect(mockedCreateVersion3Client).toHaveBeenCalledWith(configuration);
  });

  it("should create Version3Client with email, and apiToken when authentication has email and apiToken", () => {
    const email = "email";
    const apiToken = "apiToken";
    JiraJsClientV3({
      ...configuration,
      authentication: {
        email,
        apiToken,
      },
    });

    expect(mockedCreateVersion3Client).toHaveBeenCalledWith({
      ...configuration,
      authentication: {
        basic: {
          email,
          apiToken,
        },
      },
    });
  });

  describe("getProject", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(JiraJs, "Version3Client").mockReturnValue(
        version3Client as unknown as Version3Client,
      );
      version3Client.projects.getProject.mockResolvedValue(
        jiraJsProjectResponse,
      );
    });

    it("should get project with projectKey", async () => {
      await JiraJsClientV3(configuration).getProject(projectKey);

      expect(version3Client.projects.getProject).toHaveBeenCalledWith(
        projectKey,
      );
    });

    it("should return undefined when project does not exists", async () => {
      version3Client.projects.getProject.mockRejectedValue(
        new HttpException("Request failed with status code 404", 404),
      );

      const exception = new HttpException("something", 404);
      console.log({ status: exception });

      const actual = await JiraJsClientV3(configuration).getProject(projectKey);

      expect(actual).toBeUndefined();
    });

    it("should throw error when non 500 error happen", async () => {
      version3Client.projects.getProject.mockRejectedValue(
        new HttpException("Request failed with status code 500", 500),
      );

      await expect(() =>
        JiraJsClientV3(configuration).getProject(projectKey),
      ).rejects.toEqual(new Error("Get project failed"));
    });

    it("should throw error when other exception thrown", async () => {
      version3Client.projects.getProject.mockRejectedValue(
        new Error("Other exception"),
      );

      await expect(() =>
        JiraJsClientV3(configuration).getProject(projectKey),
      ).rejects.toEqual(new Error("Get project failed"));
    });

    it("should return project info when project is exists", async () => {
      const actual = await JiraJsClientV3(configuration).getProject(projectKey);

      expect(actual?.id).toEqual(jiraJsProjectResponse.id);
      expect(actual?.key).toEqual(jiraJsProjectResponse.key);
      expect(actual?.config).toEqual(version3Client);
    });
  });
});
