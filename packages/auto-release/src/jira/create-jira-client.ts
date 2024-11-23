import { Version3Client } from "jira.js";
import { JiraConfiguration } from "@/jira/jira-configuration";
import { JiraClient } from "@/jira/jira-js-v3/jira-client";

export const createJiraClient = (configuration: JiraConfiguration) => {
  const {
    host,
    authentication: { email, apiToken },
  } = configuration;
  const version3Client = new Version3Client({
    host,
    authentication: {
      basic: {
        email,
        apiToken,
      },
    },
  });

  return JiraClient(version3Client);
};
