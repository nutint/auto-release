import { describe, it, expect } from "vitest";
import { jiraIssueV3Schema } from "@/jira/jira-js-v3/jira-issue-v3-schema";

describe("JiraIssueV3Schema", () => {
  const validIssue = {
    key: "SCRUM-01",
    id: "1234",
    fields: {
      issuetype: {
        name: "Story",
      },
      summary: "Test",
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
    },
  };

  it("should parse schema to the original object if pass validation", () => {
    const actual = jiraIssueV3Schema.parse(validIssue);

    expect(actual).toEqual(validIssue);
  });

  it("should throw error when one field is missing", () => {
    expect(() =>
      jiraIssueV3Schema.parse({
        ...validIssue,
        id: undefined,
      }),
    ).toThrow();
  });

  it("should not throw when version description is missing", () => {
    expect(() =>
      jiraIssueV3Schema.parse({
        ...validIssue,
        fields: {
          ...validIssue.fields,
          fixVersions: validIssue.fields.fixVersions.map((version) => ({
            ...version,
            description: undefined,
          })),
        },
      }),
    ).not.toThrow();
  });
});
