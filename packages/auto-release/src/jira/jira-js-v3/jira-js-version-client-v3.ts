import { HttpException, Version3Client } from "jira.js";
import { from, lastValueFrom, mergeMap, toArray } from "rxjs";
import { JiraVersion, TagIssueResult } from "@/jira/jira-version-models";
import { IJiraVersionClient } from "@/jira/jira-version-client";
import { JiraClientConfig } from "@/jira/jira-client-config";

export const JiraJsVersionClientV3 = (
  jiraVersion: JiraVersion & JiraClientConfig<Version3Client>,
): IJiraVersionClient<Version3Client> => {
  const { config: _client } = jiraVersion;
  return {
    name: jiraVersion.name,
    released: jiraVersion.released,
    id: jiraVersion.id,
    description: jiraVersion.description,
    config: _client,
    setRelease: async (release: boolean) => {
      await _client.projectVersions.updateVersion({
        id: jiraVersion.id,
        released: release,
      });
    },
    delete: async () => {
      await _client.projectVersions.deleteAndReplaceVersion({
        id: jiraVersion.id,
      });
    },
    tagIssuesFixVersion: async (
      issueIds: string[],
    ): Promise<TagIssueResult[]> => {
      const result$ = from(issueIds).pipe(
        mergeMap(async (issueId) => {
          try {
            const issue = await _client.issues.getIssue({
              issueIdOrKey: issueId,
            });
            const { fixVersions } = issue.fields;
            const foundVersion = fixVersions.find(
              (fixVersion) => fixVersion.id === jiraVersion.id,
            );

            if (foundVersion !== undefined) {
              return { issueId, result: "unchanged" };
            }

            await _client.issues.editIssue({
              issueIdOrKey: issueId,
              fields: {
                fixVersions: [...fixVersions, { id: jiraVersion.id }],
              },
            });
            return { issueId, result: "success" };
          } catch (e) {
            if (e instanceof HttpException) {
              console.log(e.response);
              return {
                issueId,
                result: "failed",
                reason: e.response as string,
              };
            }
            return { issueId, result: "failed" };
          }
        }, 4),
        toArray(),
      );

      return await lastValueFrom(result$);
    },
  };
};
