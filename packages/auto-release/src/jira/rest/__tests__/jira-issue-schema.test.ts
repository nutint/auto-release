import { describe, expect, it } from "vitest";
import { jiraIssueSchema } from "@/jira/rest/jira-issue.schema";

describe("JiraIssueSchema", () => {
  const validJiraIssue = {
    id: "12345",
    fields: {
      summary: "This is summary",
      fixVersions: [
        {
          id: "23456",
          name: "1.0.1",
          released: false,
          description: "description",
        },
      ],
      status: {
        name: "In Progress",
      },
      issuetype: {
        name: "User Story",
      },
    },
  };
  it("should return type safe object when parse validation", () => {
    const actual = jiraIssueSchema.parse(validJiraIssue);

    expect(actual).toEqual(validJiraIssue);
  });

  it("should throw error when type is incorrect", () => {
    expect(() =>
      jiraIssueSchema.parse({
        ...validJiraIssue,
        id: undefined,
      }),
    ).toThrow();
  });
});
