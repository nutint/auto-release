import { describe, it, expect, beforeEach, vi } from "vitest";
import * as CreateJiraClient from "@/jira/create-jira-client";
import { JiraConfiguration } from "@/jira/jira-configuration";
import {
  createJiraRelease,
  CreateJiraReleaseError,
} from "@/cli/commands/create-jira-release";
import { IJiraClient } from "@/jira/jira-js-v3/jira-client";
import { Version3Client } from "jira.js";
import { IJiraProjectClient } from "@/jira/jira-js-v3/jira-project-client";
import { IJiraVersionClient } from "@/jira/jira-js-v3/jira-version-client";

describe("CreateJiraRelease", () => {
  const mockedCreateJiraClient = vi.spyOn(CreateJiraClient, "createJiraClient");
  const mockedJiraClient = {
    getProject: vi.fn(),
  } as unknown as IJiraClient<Version3Client>;

  const mockedJiraProjectClient = {
    getVersions: vi.fn(),
    createVersion: vi.fn(),
  } as unknown as IJiraProjectClient<Version3Client>;
  const mockedJiraVersionClient = {
    tagIssuesFixVersion: vi.fn(),
  } as unknown as IJiraVersionClient<Version3Client>;

  const jiraConfiguration: JiraConfiguration = {
    host: "https://yourcomany.jira.com",
    authentication: {
      email: "your@email.com",
      apiToken: "api-token",
    },
  };
  const jiraProjectKey = "SCRUM";
  const jiraVersion = "1.0.0";
  const jiraIssues: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    (mockedCreateJiraClient as any).mockResolvedValue(mockedJiraClient);
    (mockedJiraClient as any).getProject.mockResolvedValue(
      mockedJiraProjectClient,
    );
    (mockedJiraProjectClient.getVersions as any).mockResolvedValue([]);
    (mockedJiraProjectClient.createVersion as any).mockResolvedValue(
      mockedJiraVersionClient,
    );
  });

  describe("createJiraRelease", () => {
    it("should create jira client with jiraConfiguration", async () => {
      await createJiraRelease(
        jiraConfiguration,
        jiraProjectKey,
        jiraVersion,
        jiraIssues,
      );

      expect(mockedCreateJiraClient).toHaveBeenCalledWith(jiraConfiguration);
    });

    it("should get project by id", async () => {
      await createJiraRelease(
        jiraConfiguration,
        jiraProjectKey,
        jiraVersion,
        jiraIssues,
      );

      expect(mockedJiraClient.getProject).toHaveBeenCalledWith(jiraProjectKey);
    });

    it("should throw error when project is not found", async () => {
      (mockedJiraClient.getProject as any).mockResolvedValue(undefined);

      await expect(() =>
        createJiraRelease(
          jiraConfiguration,
          jiraProjectKey,
          jiraVersion,
          jiraIssues,
        ),
      ).rejects.toEqual(
        new CreateJiraReleaseError(`project ${jiraProjectKey} not found`),
      );
    });

    it("should get versions", async () => {
      await createJiraRelease(
        jiraConfiguration,
        jiraProjectKey,
        jiraVersion,
        jiraIssues,
      );

      expect(mockedJiraProjectClient.getVersions).toHaveBeenCalled();
    });

    it("should throw error when version is duplicated with existing version", async () => {
      (mockedJiraProjectClient.getVersions as any).mockResolvedValue([
        { name: jiraVersion },
      ]);

      await expect(() =>
        createJiraRelease(
          jiraConfiguration,
          jiraProjectKey,
          jiraVersion,
          jiraIssues,
        ),
      ).rejects.toEqual(
        new CreateJiraReleaseError(`version ${jiraVersion} is already existed`),
      );
    });

    it("should create version when there is no duplication", async () => {
      await createJiraRelease(
        jiraConfiguration,
        jiraProjectKey,
        jiraVersion,
        jiraIssues,
      );

      expect(mockedJiraProjectClient.createVersion).toHaveBeenCalledWith({
        name: jiraVersion,
      });
    });

    it("should tag jira tickets with created version", async () => {
      await createJiraRelease(
        jiraConfiguration,
        jiraProjectKey,
        jiraVersion,
        jiraIssues,
      );

      expect(mockedJiraVersionClient.tagIssuesFixVersion).toHaveBeenCalledWith(
        jiraIssues,
      );
    });
  });
});
