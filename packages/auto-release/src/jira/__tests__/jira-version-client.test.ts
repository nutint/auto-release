import { describe, it, expect, vi, beforeEach } from "vitest";
import { JiraVersion, JiraVersionClient } from "@/jira/jira-version-client";
import { Version3Client } from "jira.js";

describe("JiraVersionClient", () => {
  const jiraJsClient = {
    projectVersions: {
      updateVersion: vi.fn(),
      deleteAndReplaceVersion: vi.fn(),
    },
  };

  const jiraVersionWithClient = {
    id: "id",
    name: "1.0.0",
    url: "url",
    description: "description",
    _client: jiraJsClient,
  } as unknown as JiraVersion & { _client: Version3Client };

  const { setRelease, delete: deleteVersion } = JiraVersionClient(
    jiraVersionWithClient,
  );

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
});
