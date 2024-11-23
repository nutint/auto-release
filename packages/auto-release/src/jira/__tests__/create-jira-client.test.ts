import { describe, it, expect, vi, beforeEach } from "vitest";
import { createJiraClient } from "../create-jira-client";
import * as JiraJs from "jira.js";
import { Version3Client } from "jira.js";
import * as GetServerInfo from "@/jira/get-server.info";
import { JiraServerInfo } from "@/jira/get-server.info";
import * as JiraRestClient from "@/jira/rest/jira-rest-client";
import { Axios } from "axios";
import { IJiraClient } from "@/jira/jira-client";

vi.mock("jira.js");

describe("CreateJiraClient", () => {
  const mockedCreateVersion3Client = vi.spyOn(JiraJs, "Version3Client");
  const mockedGetServerInfo = vi.spyOn(GetServerInfo, "getServerInfo");
  const mockedJiraRestClient = vi.spyOn(JiraRestClient, "JiraRestClient");
  const version3Client = { foo: "bar" };
  const jiraRestClient = { bar: "foo" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCreateVersion3Client.mockReturnValue(
      version3Client as unknown as Version3Client,
    );
    mockedJiraRestClient.mockReturnValue(
      jiraRestClient as unknown as IJiraClient<Axios>,
    );
    mockedGetServerInfo.mockResolvedValue({
      deploymentType: "Cloud",
    } as unknown as JiraServerInfo);
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

      expect(mockedJiraRestClient).toHaveBeenCalledWith(configuration);
    });

    it("should return JiraRestClient when server's deployment type is Server", async () => {
      mockedGetServerInfo.mockResolvedValue({
        deploymentType: "Server",
      } as unknown as JiraServerInfo);

      const actual = await createJiraClient(configuration);

      expect(actual).toEqual(jiraRestClient);
    });

    it("should create client with email and apiToken server's deployment type is Server", async () => {
      await createJiraClient(configuration);

      expect(mockedCreateVersion3Client).toHaveBeenCalledWith({
        host,
        authentication: {
          basic: {
            email,
            apiToken,
          },
        },
      });
    });

    it("should create client with personalAccessToken", async () => {
      await createJiraClient({
        ...configuration,
        authentication: {
          personalAccessToken: "PAT",
        },
      });

      expect(mockedCreateVersion3Client).toHaveBeenCalledWith({
        host,
        authentication: {
          personalAccessToken: "PAT",
        },
      });
    });

    it("should return client", async () => {
      const actual = await createJiraClient(configuration);

      expect(actual._client).toEqual(version3Client);
    });
  });
});
