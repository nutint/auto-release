import { describe, it } from "vitest";
import { readConfiguration } from "@/cli/read-configuration";
import { defaultConfigurationFile } from "@/cli/parse-arguments";
import { JiraRestClient } from "@/jira/rest/jira-rest-client";

describe("JiraServerClient", () => {
  const configuration = readConfiguration(defaultConfigurationFile);
  const jiraConfiguration = configuration.jiraConfiguration!;

  it("should be able to get project", async () => {
    const jiraClient = JiraRestClient(jiraConfiguration);

    await jiraClient.getProject("PJ");
  });
});
