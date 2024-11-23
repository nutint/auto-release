import { JiraVersion } from "@/jira/jira-version-models";
import { JiraClientConfig } from "@/jira/jira-client-config";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";
import { IJiraVersionClient } from "@/jira/jira-version-client";

export const JiraRestVersionClient = (
  jiraVersion: JiraVersion & JiraClientConfig<JiraRestClientConfig>,
): IJiraVersionClient<JiraRestClientConfig> => {
  return {
    ...jiraVersion,
  } as any;
};
