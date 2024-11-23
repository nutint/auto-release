import { describe, it, expect, vi, beforeEach } from "vitest";
import { JiraRestVersionClient } from "@/jira/rest/jira-rest-version-client";
import axios, { AxiosError } from "axios";
import { JiraVersionOperationError } from "@/jira/jira-version-models";

describe("JiraRestClientVersion", () => {
  const id = "12345";
  const name = "1.0.1";
  const projectKey = "SCRUM";
  const description = "description";
  const released = false;
  const config = {
    host: "https://host.domain.com",
    axiosRequestConfig: {},
  };
  const versionWithConfig = {
    id,
    name,
    projectKey,
    description,
    released,
    config,
  };

  const {
    setRelease,
    delete: deleteVersion,
    tagIssuesFixVersion,
    ...properties
  } = JiraRestVersionClient(versionWithConfig);

  it("should init correct properties", () => {
    expect(properties).toEqual(versionWithConfig);
  });

  describe("setRelease", () => {
    const mockedAxiosPut = vi.spyOn(axios, "put");

    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosPut.mockResolvedValue({ data: {} });
    });

    it("should set release with correct request", async () => {
      await setRelease(true);

      expect(mockedAxiosPut).toHaveBeenCalledWith(
        `${config.host}/rest/api/2/version/${id}`,
        {
          released: true,
        },
        config.axiosRequestConfig,
      );
    });

    it("should throw when api return error", async () => {
      mockedAxiosPut.mockRejectedValue(new AxiosError());

      await expect(() => setRelease(true)).rejects.toEqual(
        new JiraVersionOperationError("set version failed"),
      );
    });
  });

  describe("delete", () => {
    const mockedAxiosGet = vi.spyOn(axios, "get");

    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosGet.mockResolvedValue({ data: {} });
    });

    it("should get jira issues via search api", async () => {
      await deleteVersion();
    });
  });

  describe("tagIssuesFixVersion", () => {
    const mockedAxiosPut = vi.spyOn(axios, "put");

    const scrum1 = "SCRUM-1";
    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosPut.mockResolvedValue({
        data: {},
      });
    });

    it("should tag issues with correct request", async () => {
      await tagIssuesFixVersion([scrum1]);

      expect(mockedAxiosPut).toHaveBeenCalledWith(
        `${config.host}/rest/api/2/issue/${scrum1}`,
        {
          update: {
            fixVersions: [
              {
                add: { name },
              },
            ],
          },
        },
        config.axiosRequestConfig,
      );
    });

    it("should return issueId with success when api success", async () => {
      const actual = await tagIssuesFixVersion([scrum1]);

      expect(actual).toEqual([{ issueId: scrum1, result: "success" }]);
    });

    it("should return issueId with failed when api failed", async () => {
      mockedAxiosPut.mockRejectedValue(new AxiosError());

      const actual = await tagIssuesFixVersion([scrum1]);

      expect(actual).toEqual([{ issueId: scrum1, result: "failed" }]);
    });
  });
});
