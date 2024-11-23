import { describe, it, expect } from "vitest";
import { readConfiguration } from "@/cli/read-configuration";
import { getServerInfo } from "@/jira/get-server.info";
import { defaultConfigurationFile } from "@/cli/arguments/parse-common-arguments";

describe("GetServerInfo", () => {
  const configuration = readConfiguration(defaultConfigurationFile);
  const jiraConfiguration = configuration.jiraConfiguration!;

  describe("getServerInfo", () => {
    it("should get server info", async () => {
      const myHost = false;
      const host = myHost
        ? "https://natthaint.atlassian.net/"
        : jiraConfiguration.host;
      const actual = await getServerInfo(host);

      console.log(actual);
    });
  });
});
