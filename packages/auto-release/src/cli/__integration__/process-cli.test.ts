import { describe, it } from "vitest";
import { processCli } from "@/cli/process-cli";

describe("processCli(Integration)", () => {
  const timeout = 999999;
  it("should able analyze release", { timeout }, async () => {
    await processCli(["analyze", "--no-interactive"]);
  });

  it("should be able to release", { timeout }, async () => {
    await processCli(["release", "--jira"]);
  });

  it("should create jira version and tag tickets", { timeout }, async () => {
    await processCli([
      "create-jira-release",
      "--jira-project-key=SCRUM",
      "--jira-version-name=2.0.1",
      "--jira-issues=SCRUM-1,SCRUM-2",
    ]);
  });
});
