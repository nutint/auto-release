import { describe, it } from "vitest";
import { createJiraClient } from "@/jira/create-jira-client";
import { readConfiguration } from "@/cli/read-configuration";
import { defaultConfigurationFile } from "@/cli/arguments/common-arguments";

describe("JiraClient", () => {
  it("should get the project", async () => {
    const configuration = readConfiguration(defaultConfigurationFile);
    const { jiraConfiguration } = configuration;
    if (jiraConfiguration) {
      const jiraClient = await createJiraClient(jiraConfiguration);
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
