type BasicAuthentication = {
  email: string;
  apiToken: string;
};

type PATAuthentication = {
  personalAccessToken: string;
};

export type Authentication = BasicAuthentication | PATAuthentication;

export type JiraConfiguration = {
  host: string;
  authentication: Authentication;
};
