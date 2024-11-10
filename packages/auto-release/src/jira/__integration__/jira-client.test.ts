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
          const createdVersion = await project.createVersion({ name: "1.2.9" });

          const versions = await project.getVersions();
          console.log({ versions: versions.length });
          const [firstVersion] = versions;
          await firstVersion!.setRelease(false);

          await firstVersion!.tagIssuesFixVersion(["SCRUM-1", "SCRUM-2"]);

          await createdVersion.delete();

          const versionsAfterDeleted = await project.getVersions();
          console.log({ versionsAfterDeleted: versionsAfterDeleted.length });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
});
