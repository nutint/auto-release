import { describe, it } from "vitest";
import { addChangeLog } from "@/changelog/changelog";
import { ReleaseInformation } from "@/release-helper/release-helper";

describe("ChangeLog", () => {
  const fileContent = "# Changelog - auto-release\n\n";
  const fileName = "CHANGELOG.md";

  it("should add new change to the file", () => {
    const releaseInformation: ReleaseInformation = {
      currentVersion: "0.0.0",
      latestTagVersion: undefined,
      nextVersion: "0.0.1",
      changes: {
        minor: ["major change 1"],
        major: ["minor change 1"],
        patch: ["patch change 1"],
      },
    };

    addChangeLog(releaseInformation);
  });
});
