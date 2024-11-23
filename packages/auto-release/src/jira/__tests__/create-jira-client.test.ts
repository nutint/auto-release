import { describe, it, expect, vi, beforeEach } from "vitest";
import { createJiraClient } from "../create-jira-client";
import * as JiraJs from "jira.js";
import { Version3Client } from "jira.js";

vi.mock("jira.js");

describe("CreateJiraClient", () => {
  const mockedCreateVersion3Client = vi.spyOn(JiraJs, "Version3Client");
  const version3Client = { foo: "bar" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCreateVersion3Client.mockReturnValue(
      version3Client as unknown as Version3Client,
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

    it("should create client with email and apiToken", () => {
      createJiraClient(configuration);

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

    it("should create client with personalAccessToken", () => {
      createJiraClient({
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

    it("should return client", () => {
      const actual = createJiraClient(configuration);

      expect(actual._client).toEqual(version3Client);
    });
  });
});
