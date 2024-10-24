import { Version3Client } from "jira.js";

import { JiraConfiguration } from "@/jira/jira-configuration";

export const createJiraClient = async (configuration: JiraConfiguration) => {
  const {
    host,
    authentication: { email, apiToken },
  } = configuration;
  const client = new Version3Client({
    host,
    authentication: {
      basic: {
        email,
        apiToken,
      },
    },
  });

  const users = await client.userSearch.findUsers({
    query: "myemail@email.com",
  });
  const projects = await client.projects.searchProjects();

  const myFirstProject = projects.values[0];
  if (myFirstProject) {
    const createdIssue = await client.issues.createIssue({
      fields: {
        summary: "My second issue",
        issuetype: {
          name: "Task",
        },
        project: {
          key: myFirstProject.key,
        },
      },
    });

    const createdVersion = await client.projectVersions.createVersion({
      name: "1.0.0",
      projectId: parseInt(myFirstProject.id),
    });
    console.log({
      users,
      project: myFirstProject,
      createdIssue,
      createdVersion,
    });
  }
};
