import { describe, it } from "vitest";
import { createJiraClient } from "@/jira/create-jira-client";
import { parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";

describe("JiraClient", () => {
  it("should get the project", async () => {
    const parsedArgument = parseArguments([]);
    const configuration = readConfiguration(parsedArgument.configFile);
    const { jiraConfiguration } = configuration;
    if (jiraConfiguration) {
      const jiraClient = createJiraClient(jiraConfiguration);
      try {
        const project = await jiraClient.getProject("SCRUM");
        if (project) {
          const createdVersion = await project.createVersion({ name: "1.0.2" });
          console.log({ createdVersion });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
});
