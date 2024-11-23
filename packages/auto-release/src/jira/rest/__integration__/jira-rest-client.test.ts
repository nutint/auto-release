import { describe, it } from "vitest";
import { readConfiguration } from "@/cli/read-configuration";
import { JiraRestClient } from "@/jira/rest/jira-rest-client";
import { defaultConfigurationFile } from "@/cli/arguments/common-arguments";
import { logger } from "@/logger/logger";

describe("JiraServerClient", () => {
  const configuration = readConfiguration(defaultConfigurationFile);
  const jiraConfiguration = configuration.jiraConfiguration!;

  it("should be able to get project", async () => {
    const jiraClient = JiraRestClient(jiraConfiguration);

    const project = await jiraClient.getProject("PJ");
    if (project) {
      const issue = await project.getIssue("PJ-52");
      logger.info(issue);
    }
  });
});
