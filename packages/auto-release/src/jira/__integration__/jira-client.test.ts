import { describe, it } from "vitest";
import { createJiraClient } from "@/jira/create-jira-client";
import { parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";

describe("JiraClient", () => {
  it("should get the project", async () => {
    const parsedArgument = parseArguments(["analyze"]);
    const configuration = readConfiguration(parsedArgument.configFile);
    const { jiraConfiguration } = configuration;
    if (jiraConfiguration) {
      const jiraClient = createJiraClient(jiraConfiguration);
      try {
        const project = await jiraClient.getProject("SCRUM");
        if (project) {
          const versions = await project.getVersions();
          console.log({ versions });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
});
