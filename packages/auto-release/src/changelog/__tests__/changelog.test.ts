import { describe, it } from "vitest";
import { addChangeLog } from "@/changelog/changelog";
import { ReleaseInformation } from "@/release-helper/release-helper";

describe("ChangeLog", () => {
  describe("addChangeLog", () => {
    const releaseInformation: ReleaseInformation = {
      currentVersion: "0.0.0",
      latestTagVersion: undefined,
      nextVersion: "0.0.1",
      changes: {
        minor: [],
        major: [],
        patch: [],
      },
    };
    it("should not throw exception", async () => {
      await addChangeLog(releaseInformation);
    });
  });
});
