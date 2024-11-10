import { HttpException, Version3Client } from "jira.js";
import { from, lastValueFrom, mergeMap, toArray } from "rxjs";

export type JiraVersionInput = {
  name: string;
};

export type JiraVersion = JiraVersionInput & {
  url?: string;
  id: string;
  description?: string;
};

type TagIssueResult = {
  issueId: string;
  result: string;
  reason?: string;
};

export type IJiraVersionClient<T> = JiraVersion & {
  _client: T;
  setRelease: (release: boolean) => Promise<void>;
  delete: () => Promise<void>;
  tagIssuesFixVersion: (issueIds: string[]) => Promise<TagIssueResult[]>;
};

export const JiraVersionClient = (
  jiraVersion: JiraVersion & { _client: Version3Client },
): IJiraVersionClient<Version3Client> => {
  const { _client } = jiraVersion;
  return {
    name: jiraVersion.name,
    url: jiraVersion.url,
    id: jiraVersion.id,
    description: jiraVersion.description,
    _client,
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
