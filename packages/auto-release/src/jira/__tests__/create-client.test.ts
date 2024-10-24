import { describe, it, expect } from "vitest";
import { createJiraClient } from "../create-jira-client";

describe("CreateClient", () => {
  describe("createJiraClient", () => {
    it.skip("should create client", async () => {
      const host = "https://yourdomain.atlassian.net";
      const apiToken = "apiToken";
      await createJiraClient({
        host,
        authentication: {
          email: "nattha.int@gmail.com",
          apiToken,
        },
      });
    });
  });
});
