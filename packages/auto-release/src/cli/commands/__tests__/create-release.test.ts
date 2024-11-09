import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRelease } from "@/cli/commands/create-release";

describe("CreateRelease", () => {
  describe("createRelease", () => {
    const mockedConsoleLog = vi.spyOn(console, "log");

    beforeEach(() => {
      vi.clearAllMocks();
      mockedConsoleLog.mockReturnValue();
    });
    it("should just console.log for now", async () => {
      await createRelease({ version: "1.0.1" });

      expect(mockedConsoleLog).toHaveBeenCalledWith(
        "creating release version: 1.0.1",
      );
    });
  });
});
