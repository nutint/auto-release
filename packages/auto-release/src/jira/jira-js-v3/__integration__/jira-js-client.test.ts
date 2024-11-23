import { describe, it } from "vitest";
import { JiraJsClientV3 } from "@/jira/jira-js-v3/jira-js-client-v3";
import { readConfiguration } from "@/cli/read-configuration";
import { defaultConfigurationFile } from "@/cli/arguments/common-arguments";
import { logger } from "@/logger/logger";

describe("JiraJsClient", () => {
  const configuration = readConfiguration(defaultConfigurationFile);
  const jiraConfiguration = configuration.jiraConfiguration!;
  it("should get project", { timeout: 99999 }, async () => {
    const jiraClient = JiraJsClientV3(jiraConfiguration);

    const project = await jiraClient.getProject("SCRUM");
    if (project) {
      const createdVersion = await project.createVersion({
        name: "1.2.3",
      });
      const tagIssueResults = await createdVersion.tagIssuesFixVersion([
        "SCRUM-129",
        "SCRUM-125",
        "SCRUM-124",
      ]);
      console.error({ tagIssueResults });
      await createdVersion.delete();
    }
    logger.error(project);
  });
});
