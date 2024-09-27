import { describe, it, expect, vi, beforeEach } from "vitest";
import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import * as GitLog from "@/git/git-log";

vi.mock("@/git/git-log");

describe("GitHelper", () => {
  const gitHelperInstance = gitHelper();

  const mockedGetGitLogs = vi.spyOn(GitLog, "getGitLogs");

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetGitLogs.mockResolvedValue([]);
  });

  describe("getLogs", () => {
    it("should get log with correct parameters", async () => {
      const getLogConfig = createLogConfig({ scope: "id24" });
      await gitHelperInstance.getLogs(getLogConfig);

      expect(mockedGetGitLogs).toHaveBeenCalledWith(getLogConfig, {});
    });

    it("should return result from getGitLogs", async () => {
      const getLogConfig = createLogConfig({ scope: "id24" });
      const result = await gitHelperInstance.getLogs(getLogConfig);
      expect(result).toEqual([]);
    });
  });
});
