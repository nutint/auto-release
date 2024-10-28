import { JiraConfiguration } from "@/jira/jira-configuration";
import { VersionRulesConfiguration } from "@/version/version-rules-schema";
import { VersionSourceConfiguration } from "@/release-helper/release-helper";

export type Configuration = {
  jiraBaseUrl?: string;
  jiraConfiguration?: JiraConfiguration;
  versionRules?: VersionRulesConfiguration;
  versionSource?: VersionSourceConfiguration;
};
