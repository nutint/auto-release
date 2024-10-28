import { JiraConfiguration } from "@/jira/jira-configuration";
import { VersionRulesConfiguration } from "@/version/version-rules-configuration";

import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";

export type Configuration = {
  jiraBaseUrl?: string;
  jiraConfiguration?: JiraConfiguration;
  versionRules?: VersionRulesConfiguration;
  versionSource?: VersionSourceConfiguration;
};
