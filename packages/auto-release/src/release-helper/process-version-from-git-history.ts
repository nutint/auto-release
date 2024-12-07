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
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";
import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import {
  ExtractedJiraIssue,
  extractJiraIssue,
} from "@/release-helper/process-jira-issues-from-git-history";

type ProcessVersionParams = {
  gitTagPrefix?: string;
  scope?: string;
  jiraProjectKey?: string;
};

export const processVersionFromGitHistory = async ({
  gitTagPrefix,
  scope,
  jiraProjectKey,
}: ProcessVersionParams) => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope }))
    .pipe(
      connect(($conventionalCommits) =>
        forkJoin({
          latestGitTag: $conventionalCommits.pipe(
            $processVersionFromGitHistory({ gitTagPrefix }),
          ),
          jiraIssues: $conventionalCommits.pipe(
            switchMap((commit) =>
              jiraProjectKey !== undefined ? of(commit) : EMPTY,
            ),
            $processJiraIssuesFromGitHistory(<string>jiraProjectKey),
          ),
        }),
      ),
    );

  return await lastValueFrom($result);
};

export const $processVersionFromGitHistory =
  ({ gitTagPrefix }: ProcessVersionParams) =>
  ($conventionalCommits: Observable<MappedCommit<ConventionalCommit>>) =>
    $conventionalCommits.pipe(
      $extractTags(gitTagPrefix),
      map(
        (versionInfo) =>
          versionInfo.latestStableTags[versionInfo.latestStableTags.length - 1],
      ),
    );

type CommitWithJiraIssue = MappedCommit<ConventionalCommit> & {
  jira: ExtractedJiraIssue;
};

export type JiraIssueWithCommits = {
  issueId?: string;
  commits: CommitWithJiraIssue[];
};

export const $processJiraIssuesFromGitHistory =
  (projectKey: string) =>
  (
    $conventionalCommits: Observable<MappedCommit<ConventionalCommit>>,
  ): Observable<JiraIssueWithCommits[]> => {
    return $conventionalCommits.pipe(
      map((commit) => ({
        ...commit,
        jira: extractJiraIssue(commit.mapped.subject, projectKey),
      })),
      reduce<CommitWithJiraIssue, JiraIssueWithCommits[]>((issues, current) => {
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
