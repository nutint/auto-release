import { describe, it, expect, vi, beforeEach } from "vitest";
import { createJiraClient } from "../create-jira-client";
import { Version3Client } from "jira.js";
import * as GetServerInfo from "@/jira/get-server.info";
import { JiraServerInfo } from "@/jira/get-server.info";
import * as JiraRestClient from "@/jira/rest/jira-rest-client";
import { IJiraClient } from "@/jira/jira-client";
import * as JiraJsClientV3 from "@/jira/jira-js-v3/jira-js-client-v3";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";

describe("CreateJiraClient", () => {
  const mockedGetServerInfo = vi.spyOn(GetServerInfo, "getServerInfo");
  const mockedJiraJsClientV3 = vi.spyOn(JiraJsClientV3, "JiraJsClientV3");
  const mockedJiraRestClient = vi.spyOn(JiraRestClient, "JiraRestClient");
  const jiraJsClientV3 = { foo: "bar" };
  const jiraRestClient = { bar: "foo" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetServerInfo.mockResolvedValue({
      deploymentType: "Cloud",
    } as unknown as JiraServerInfo);
    mockedJiraJsClientV3.mockReturnValue(
      jiraJsClientV3 as unknown as IJiraClient<Version3Client>,
    );
    mockedJiraRestClient.mockReturnValue(
      jiraRestClient as unknown as IJiraClient<JiraRestClientConfig>,
    );
  });

  describe("createJiraClient", () => {
    const host = "https://yourdomain.atlassian.net";
    const apiToken = "apiToken";
    const email = "nattha.int@gmail.com";
    const configuration = {
      host,
      authentication: {
        email,
        apiToken,
      },
    };

    it("should get server info", async () => {
      await createJiraClient(configuration);

      expect(mockedGetServerInfo).toHaveBeenCalledWith(host);
    });

    it("should create JiraRestClient when server's deployment type is Server", async () => {
      mockedGetServerInfo.mockResolvedValue({
        deploymentType: "Server",
      } as unknown as JiraServerInfo);

      await createJiraClient(configuration);

      expect(mockedJiraJsClientV3).toHaveBeenCalledWith(configuration);
    });

    it("should return JiraRestClient when server's deployment type is Server", async () => {
      mockedGetServerInfo.mockResolvedValue({
        deploymentType: "Server",
      } as unknown as JiraServerInfo);

      const actual = await createJiraClient(configuration);

      expect(actual).toEqual(jiraJsClientV3);
    });

    it("should create JiraJsClientV3 when server's deployment type is Cloud", async () => {
      await createJiraClient(configuration);

      expect(mockedJiraJsClientV3).toHaveBeenCalledWith(configuration);
    });

    it("should return JiraJsClientV3 when server's deployment type is Cloud", async () => {
      const actual = await createJiraClient(configuration);

      expect(actual).toEqual(jiraJsClientV3);
    });
  });
});
