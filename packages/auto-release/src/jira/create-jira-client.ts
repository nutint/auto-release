import { Config, Version3Client } from "jira.js";
import { JiraConfiguration } from "@/jira/jira-configuration";
import { JiraJsV3Client } from "@/jira/jira-js-v3/jira-client";
import { getServerInfo } from "@/jira/get-server.info";
import { JiraRestClient } from "@/jira/rest/jira-rest-client";

export const createJiraClient = async (configuration: JiraConfiguration) => {
  const { host, authentication } = configuration;
  const { deploymentType } = await getServerInfo(host);
  if (deploymentType === "Server") {
    return JiraRestClient(configuration);
  }
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

  return JiraJsV3Client(version3Client);
};
