import { Version3Client } from "jira.js";
import { JiraConfiguration } from "@/jira/jira-configuration";
import { JiraJsClientV3 } from "@/jira/jira-js-v3/jira-js-client-v3";
import { JiraRestClient } from "@/jira/rest/jira-rest-client";
import { getServerInfo } from "@/jira/get-server.info";

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

  return JiraJsClientV3(version3Client);
};
