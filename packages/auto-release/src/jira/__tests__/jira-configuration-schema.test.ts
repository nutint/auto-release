import { describe, it, expect } from "vitest";
import { jiraConfigurationSchema } from "../jira-configuration-schema";
import { JiraConfiguration } from "@/jira/jira-configuration";

describe("schema", () => {
  const defaultConfiguration = {
    host: "https://abc.jira.net",
    authentication: {
      email: "abc@example.com",
      apiToken: "apiToken",
    },
  };

  const extractJiraConfiguration = (
    unvalidatedConfiguration: object,
  ): JiraConfiguration => {
    try {
      return jiraConfigurationSchema.parse(unvalidatedConfiguration);
    } catch (e) {
      throw new Error("Invalid Jira configuration: missing host");
    }
  };

  it("should throw error when it's no host field", () => {
    expect(() =>
      extractJiraConfiguration({
        ...defaultConfiguration,
        host: undefined,
      }),
    ).toThrow(new Error("Invalid Jira configuration: missing host"));
  });

  it("should return valid configuration when parse correct configuration", () => {
    const actual = extractJiraConfiguration(defaultConfiguration);

    expect(actual).toEqual(defaultConfiguration);
  });
});
