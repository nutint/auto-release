import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  JiraRestClient,
  mapToAuthorizationHeader,
} from "@/jira/rest/jira-rest-client";
import axios from "axios";
import { getUserAgent } from "@/jira/get-server.info";

describe("JiraRestClient", () => {
  const mockedAxiosGet = vi.spyOn(axios, "get");

  const host = "https://host.domain.com";
  const jiraConfiguration = {
    host,
    authentication: {
      personalAccessToken: "PAT",
    },
  };
  const projectKey = "SCRUM";

  const { getProject } = JiraRestClient(jiraConfiguration);

  describe("getProject", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosGet.mockResolvedValue({ data: { id: "12345", key: "SCRUM" } });
    });

    it("should call axios with valid url, and headers", async () => {
      await getProject(projectKey);

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        `${host}/rest/api/2/project/${projectKey}`,
        {
          headers: {
            Authorization: mapToAuthorizationHeader(
              jiraConfiguration.authentication,
            ),
            "Content-Type": "application/json",
            "User-Agent": getUserAgent(),
          },
        },
      );
    });

    it("should return valid attribute", async () => {
      const actual = await getProject(projectKey);

      expect(actual?.key).toEqual("SCRUM");
      expect(actual?.id).toEqual("12345");
    });
  });

  describe("mapToAuthorizationHeader", () => {
    it("should use Bearer token directly if it's personal access token", () => {
      const actual = mapToAuthorizationHeader(jiraConfiguration.authentication);

      expect(actual).toEqual(
        `Bearer ${jiraConfiguration.authentication.personalAccessToken}`,
      );
    });

    it("should use Basic with base64 encoded string with user email and apiToken", () => {
      const email = "email@domain.com";
      const apiToken = "apiToken";
      const actual = mapToAuthorizationHeader({
        email,
        apiToken,
      });

      expect(actual).toEqual(
        Buffer.from(`${email}:${apiToken}`).toString("base64"),
      );
    });
  });
});
