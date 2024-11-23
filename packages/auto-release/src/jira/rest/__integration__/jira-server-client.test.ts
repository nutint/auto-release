import { describe, it } from "vitest";
import { readConfiguration } from "@/cli/read-configuration";
import { defaultConfigurationFile } from "@/cli/parse-arguments";
import { JiraServerClient } from "@/jira/rest/jira-server-client";

describe("JiraServerClient", () => {
  const configuration = readConfiguration(defaultConfigurationFile);
  const jiraConfiguration = configuration.jiraConfiguration!;

  it("should be able to get project", async () => {
    const jiraClient = JiraServerClient(jiraConfiguration);

    await jiraClient.getProject("PJ");
  });
});
