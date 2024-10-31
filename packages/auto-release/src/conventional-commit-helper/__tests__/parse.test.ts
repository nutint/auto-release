import { describe, it, expect } from "vitest";
import { parseConventionalMessage } from "@/conventional-commit-helper/conventional-commit-helper";

import { InvalidGitLogCommitFormat } from "@/commit-parser/parse-commit";

describe("Parse", () => {
  describe("parseConventionalMessage", () => {
    it("should throw error when passing empty string", () => {
      expect(() => parseConventionalMessage("")).toThrow(
        new InvalidGitLogCommitFormat("Empty commit message"),
      );
    });

    it("should throw error when missing type of commit", () => {
      expect(() => parseConventionalMessage("abc")).toThrow(
        new InvalidGitLogCommitFormat(
          "Invalid commit type required subject and valid commit type",
        ),
      );
    });

    it("should throw error when missing subject", () => {
      expect(() => parseConventionalMessage("feat:")).toThrow(
        new InvalidGitLogCommitFormat(
          "Invalid commit type required subject and valid commit type",
        ),
      );
    });

    it("should parse the following commit message", () => {
      const commitMessage = `feat(login): add user authentication

this is body


BREAKING CHANGE: this is footer`;

      const actual = parseConventionalMessage(commitMessage);

      expect(actual).toEqual({
        header: "feat(login): add user authentication",
        body: "this is body",
        footer: "BREAKING CHANGE: this is footer",
        notes: [{ title: "BREAKING CHANGE", text: "this is footer" }],
        type: "feat",
        scope: "login",
        subject: "add user authentication",
      });
    });
  });
});
