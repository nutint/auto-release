import { describe, it } from "vitest";
import { readConfiguration } from "@/cli/read-configuration";
import { JiraRestClient } from "@/jira/rest/jira-rest-client";
import { defaultConfigurationFile } from "@/cli/arguments/common-arguments";

describe("JiraRestClient", () => {
  const configuration = readConfiguration(defaultConfigurationFile);
  const jiraConfiguration = configuration.jiraConfiguration!;

  it("should be able to get project", { timeout: 999999 }, async () => {
    const jiraClient = JiraRestClient(jiraConfiguration);

    const project = await jiraClient.getProject("SCRUM");
    if (project) {
      const versions = await project.getVersions();
      await versions[0]!.delete();
    }
  });
});
