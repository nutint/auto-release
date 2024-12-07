import { describe, it } from "vitest";
import { processCli } from "@/cli/process-cli";

describe("processCli(Integration)", () => {
  it("should able to process cli", { timeout: 9999999 }, async () => {
    await processCli(["analyze", "--no-interactive"]);
  });

  it(
    "should create jira version and tag tickets",
    { timeout: 999999 },
    async () => {
      await processCli([
        "create-jira-release",
        "--jira-project-key=SCRUM",
        "--jira-version-name=2.0.1",
        "--jira-issues=SCRUM-1,SCRUM-2",
      ]);
    },
  );
});
