import { Config, Version3Client } from "jira.js";
import { JiraConfiguration } from "@/jira/jira-configuration";
import { JiraClient } from "@/jira/jira-js-v3/jira-client";

export const createJiraClient = (configuration: JiraConfiguration) => {
  const { host, authentication } = configuration;
  const version3Client = new Version3Client({
    host,
    authentication:
      "personalAccessToken" in authentication
        ? { personalAccessToken: authentication.personalAccessToken }
        : {
            basic: {
              email: authentication.email,
              apiToken: authentication.apiToken,
            },
          },
  });

  return JiraClient(version3Client);
};
