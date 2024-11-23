import { describe, it, expect } from "vitest";
import { jiraVersionSchema } from "@/jira/rest/jira-version-schema";

describe("JiraVersionSchema", () => {
  const validVersionSchema = {
    id: "12345",
    name: "1.0.1",
    description: "description",
    released: true,
  };

  it("should pass validation when parse valid version", () => {
    const actual = jiraVersionSchema.parse(validVersionSchema);

    expect(actual).toEqual(validVersionSchema);
  });

  it("should pass validation when no description", () => {
    const actual = jiraVersionSchema.parse({
      ...validVersionSchema,
      description: undefined,
    });

    expect(actual).toEqual({
      ...validVersionSchema,
      description: undefined,
    });
  });
});
