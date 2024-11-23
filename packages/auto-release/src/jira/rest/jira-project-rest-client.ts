import {
  IJiraProjectClient,
  JiraProjectClientParams,
} from "@/jira/jira-project-client";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";

export const JiraProjectRestClient = ({
  key: projectKey,
  id: projectId,
  config,
}: JiraProjectClientParams<JiraRestClientConfig>): IJiraProjectClient<JiraRestClientConfig> => {
  return {} as any;
};
