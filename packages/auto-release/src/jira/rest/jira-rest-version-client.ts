import {
  JiraVersion,
  JiraVersionOperationError,
} from "@/jira/jira-version-models";
import { JiraClientConfig } from "@/jira/jira-client-config";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";
import { IJiraVersionClient } from "@/jira/jira-version-client";
import axios from "axios";
import { from, lastValueFrom, mergeMap, toArray } from "rxjs";
import { logger } from "@/logger/logger";

export const JiraRestVersionClient = (
  jiraVersion: JiraVersion & JiraClientConfig<JiraRestClientConfig>,
): IJiraVersionClient<JiraRestClientConfig> => {
  const { config, name, id } = jiraVersion;
  return {
    ...jiraVersion,
    setRelease: async (released: boolean) => {
      try {
        await axios.put(
          `${config.host}/rest/api/2/version/${id}`,
          { released },
          config.axiosRequestConfig,
        );
      } catch (e) {
        throw new JiraVersionOperationError("set version failed");
      }
    },
    tagIssuesFixVersion: async (issueIds: string[]) => {
      const result$ = from(issueIds).pipe(
        mergeMap(async (issueId) => {
          try {
            await axios.put(
              `${config.host}/rest/api/2/issue/${issueId}`,
              {
                update: {
                  fixVersions: [
                    {
                      add: { name },
                    },
                  ],
                },
              },
              config.axiosRequestConfig,
            );
            return { issueId, result: "success" };
          } catch (e) {
            return { issueId, result: "failed" };
          }
        }, 4),
        toArray(),
      );
      return await lastValueFrom(result$);
    },
    delete: async () => {
      const result = await axios.get(
        `${config.host}/rest/api/2/search?jql=project=%22${jiraVersion.projectKey}%22&fixVersion=%22${name}%22&fields=summary`,
        config.axiosRequestConfig,
      );
      logger.error(result.data);
    },
  };
};
