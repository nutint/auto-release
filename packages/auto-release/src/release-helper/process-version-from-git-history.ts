import { $extractTags } from "@/release-helper/version-helper/get-version-info-from-git-history";
import {
  connect,
  EMPTY,
  forkJoin,
  lastValueFrom,
  map,
  Observable,
  of,
  reduce,
  switchMap,
} from "rxjs";
import { MappedCommit } from "@/git/git-log";
import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import {
  ExtractedJiraIssue,
  extractJiraIssue,
} from "@/release-helper/process-jira-issues-from-git-history";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";
import {
  $processChangesFromGitHistory,
  Changes,
} from "@/release-helper/process-changes-from-git-history";

type ProcessVersionParams = {
  gitTagPrefix?: string;
  scope?: string;
  jiraProjectKey?: string;
  commitFormat?: string;
};

export const processVersionFromGitHistory = async ({
  gitTagPrefix,
  scope,
  jiraProjectKey,
  commitFormat,
}: ProcessVersionParams) => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope, commitFormat }))
    .pipe(
      connect(($commitInfos) =>
        forkJoin({
          latestGitTag: $commitInfos.pipe(
            $processVersionFromGitHistory({ gitTagPrefix }),
          ),
          jiraIssues: $commitInfos.pipe(
            switchMap((commit) =>
              jiraProjectKey !== undefined ? of(commit) : EMPTY,
            ),
            $processJiraIssuesFromGitHistory(<string>jiraProjectKey),
          ),
          changes: $commitInfos.pipe($processChangesFromGitHistory()),
        }),
      ),
    );

  return await lastValueFrom($result);
};

export const $processVersionFromGitHistory =
  ({ gitTagPrefix }: ProcessVersionParams) =>
  <T>($conventionalCommits: Observable<MappedCommit<T>>) =>
    $conventionalCommits.pipe(
      $extractTags(gitTagPrefix),
      map(
        (versionInfo) =>
          versionInfo.latestStableTags[versionInfo.latestStableTags.length - 1],
      ),
    );

type CommitWithJiraIssue<T> = MappedCommit<T> & {
  jira: ExtractedJiraIssue;
};

export type JiraIssueWithCommits<T> = {
  issueId?: string;
  commits: CommitWithJiraIssue<T>[];
};

export const $processJiraIssuesFromGitHistory =
  (projectKey: string) =>
  (
    $commitInfos: Observable<MappedCommit<CommitInfo>>,
  ): Observable<JiraIssueWithCommits<CommitInfo>[]> => {
    return $commitInfos.pipe(
      map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
      reduce<
        CommitWithJiraIssue<CommitInfo>,
        JiraIssueWithCommits<CommitInfo>[]
      >((issues, current) => {
        if (current.jira.issueId === undefined) {
          if (
            issues.find((issue) => issue.issueId === undefined) === undefined
          ) {
            return [...issues, { commits: [current] }];
          }
          return issues.map((issue) =>
            issue.issueId === undefined
              ? { ...issue, commits: [...issue.commits, current] }
              : issue,
          );
        }
        const existingIssue = issues.find(
          (issue) => issue.issueId === current.jira.issueId,
        );
        if (existingIssue === undefined) {
          return [
            ...issues,
            { issueId: current.jira.issueId, commits: [current] },
          ];
        }
        return issues.map((issue) => {
          if (issue.issueId === current.jira.issueId) {
            return {
              ...issue,
              commits: [...issue.commits, current],
            };
          }
          return issue;
        });
      }, []),
    );
  };
