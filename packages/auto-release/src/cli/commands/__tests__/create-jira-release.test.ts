import { describe, it, expect, beforeEach, vi } from "vitest";
import * as CreateJiraClient from "@/jira/create-jira-client";
import * as CreateJiraReleaseCommand from "@/cli/arguments/create-jira-release-command";
import { JiraConfiguration } from "@/jira/jira-configuration";
import {
  CreateJiraReleaseError,
  createJiraRelease,
} from "@/cli/commands/create-jira-release";
import { Version3Client } from "jira.js";
import { IJiraClient } from "@/jira/jira-client";
import { IJiraVersionClient } from "@/jira/jira-version-client";
import { IJiraProjectClient } from "@/jira/jira-project-client";

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
    const mockedParsedCreateJiraReleaseCommand = vi.spyOn(
      CreateJiraReleaseCommand,
      "parseCreateJiraReleaseCommand",
    );
    const args: string[] = [];

    const parsedCommand = {
      projectKey: jiraProjectKey,
      versionName: jiraVersion,
      issues: jiraIssues,
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedParsedCreateJiraReleaseCommand.mockReturnValue(parsedCommand);
    });

    it("should throw error when no jiraConfiguration from configuration", async () => {
      await expect(() => createJiraRelease({}, args)).rejects.toEqual(
        new CreateJiraReleaseError("missing Jira configuration"),
      );
    });

    it("should parseCreateJiraReleaseCommand with arguments", async () => {
      await createJiraRelease({ jiraConfiguration }, args);

      expect(mockedParsedCreateJiraReleaseCommand).toHaveBeenCalledWith(args);
    });

    it("should create jira client", async () => {
      await createJiraRelease({ jiraConfiguration }, args);

      expect(mockedCreateJiraClient).toHaveBeenCalledWith(jiraConfiguration);
    });

    it("should get project by id", async () => {
      await createJiraRelease({ jiraConfiguration }, args);

      expect(mockedJiraClient.getProject).toHaveBeenCalledWith(jiraProjectKey);
    });

    it("should throw error when project is not found", async () => {
      (mockedJiraClient.getProject as any).mockResolvedValue(undefined);

      await expect(() =>
        createJiraRelease({ jiraConfiguration }, args),
      ).rejects.toEqual(
        new CreateJiraReleaseError(`project ${jiraProjectKey} not found`),
      );
    });

    it("should get versions", async () => {
      await createJiraRelease({ jiraConfiguration }, args);

      expect(mockedJiraProjectClient.getVersions).toHaveBeenCalled();
    });

    it("should throw error when version is duplicated with existing version", async () => {
      (mockedJiraProjectClient.getVersions as any).mockResolvedValue([
        { name: jiraVersion },
      ]);

      await expect(() =>
        createJiraRelease({ jiraConfiguration }, args),
      ).rejects.toEqual(
        new CreateJiraReleaseError(`version ${jiraVersion} is already existed`),
      );
    });

    it("should create version when there is no duplication", async () => {
      await createJiraRelease({ jiraConfiguration }, args);

      expect(mockedJiraProjectClient.createVersion).toHaveBeenCalledWith({
        name: jiraVersion,
      });
    });

    it("should tag jira tickets with created version", async () => {
      await createJiraRelease({ jiraConfiguration }, args);

      expect(mockedJiraVersionClient.tagIssuesFixVersion).toHaveBeenCalledWith(
        jiraIssues,
      );
    });
  });
});
