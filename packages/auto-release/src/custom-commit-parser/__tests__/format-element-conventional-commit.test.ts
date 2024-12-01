import { describe, it, expect } from "vitest";
import { createFormatElementConventionalCommit } from "@/custom-commit-parser/format-element-conventional-commit";

describe("FormatElementConventionalCommit", () => {
  const { extract } = createFormatElementConventionalCommit();

  describe("extract", () => {
    it("should extract conventional commit and empty remaining input", () => {
      const actual = extract("feat: a feature commit");

      expect(actual).toEqual({
        value: {
          header: "feat: a feature commit",
          notes: [],
          scope: null,
          subject: "a feature commit",
          type: "feat",
        },
        remainingInput: "",
      });
    });
  });
});
