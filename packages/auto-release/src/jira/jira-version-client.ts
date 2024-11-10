import { Version3Client } from "jira.js";

export type JiraVersionInput = {
  name: string;
};

export type JiraVersion = JiraVersionInput & {
  url?: string;
  id: string;
  description?: string;
};
export type IJiraVersionClient<T> = JiraVersion & {
  _client: T;
  setRelease: (release: boolean) => Promise<void>;
  delete: () => Promise<void>;
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
  };
};
