import { describe, it, expect } from "vitest";
import { JiraProjectRestClient } from "@/jira/rest/jira-project-rest-client";

describe("JiraProjectRestClient", () => {
  it("should return empty object", () => {
    const actual = JiraProjectRestClient({
      key: "SCRUM",
      id: "id",
      config: {},
    });

    expect(actual).toEqual({});
  });
});
