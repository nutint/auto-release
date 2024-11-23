import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerInfo, getUserAgent } from "@/jira/get-server.info";
import axios from "axios";

describe("GetServerInfo", () => {
  describe("getServerInfo", () => {
    const mockedAxiosGet = vi.spyOn(axios, "get");

    const host = "https://host.jira.com";
    const getServerInfoResponse = {
      deploymentType: "Server",
      version: "1.0.0",
      buildDate: "buildDate",
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedAxiosGet.mockResolvedValue({ data: getServerInfoResponse });
    });

    it("should call axios get method with valid url", async () => {
      await getServerInfo(host);

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        `${host}/rest/api/2/serverInfo`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": getUserAgent(),
          },
        },
      );
    });

    it("should map result to return correctly", async () => {
      const actual = await getServerInfo(host);

      expect(actual).toEqual(getServerInfoResponse);
    });
  });
});
