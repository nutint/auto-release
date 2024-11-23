import { JiraConfiguration } from "@/jira/jira-configuration";
import { JiraJsClientV3 } from "@/jira/jira-js-v3/jira-js-client-v3";
import { getServerInfo } from "@/jira/get-server.info";

export const createJiraClient = async (configuration: JiraConfiguration) => {
  const { host } = configuration;
  const { deploymentType } = await getServerInfo(host);

  if (deploymentType === "Server") {
    return JiraJsClientV3(configuration);
  }
  return JiraJsClientV3(configuration);
};
