import { JiraConfiguration } from "@/jira/jira-configuration";
import { VersionRulesConfiguration } from "@/version/version-rules-schema";

export type Configuration = {
  jiraBaseUrl?: string;
  jiraConfiguration?: JiraConfiguration;
  versionRules?: VersionRulesConfiguration;
};
