import { describe, expect, it } from "vitest";
import {
  InvalidGitLogCommitFormat,
  parseCommit,
} from "@/commit-parser/parse-commit";

describe("parseCommit", () => {
  it("should throw invalid format error logged commit is empty string", async () => {
    expect(() => parseCommit("")).toThrow(
      new InvalidGitLogCommitFormat("Empty commit message"),
    );
  });

  it("should return all properties", () => {
    const message = "chore(repo): add pre-push";
    const loggedCommit =
      "c6f72d62b89f82c673a3cb74e67f88f6f6b058bd\n" +
      "TestAuthor\n" +
      "Sat Aug 24 13:08:46 2024 +0700\n" +
      "tag: v1.0.1, tag: stable\n" +
      message +
      "\n";
    const actual = parseCommit(loggedCommit);

    expect(actual).toEqual({
      hash: "c6f72d62b89f82c673a3cb74e67f88f6f6b058bd",
      author: "TestAuthor",
      date: "Sat Aug 24 13:08:46 2024 +0700",
      message: "chore(repo): add pre-push",
      tags: ["v1.0.1", "stable"],
    });
  });

  it("should return empty tags when tagLine not start with tag:", () => {
    const message = "chore(repo): add pre-push";
    const loggedCommit =
      "c6f72d62b89f82c673a3cb74e67f88f6f6b058bd\n" +
      "TestAuthor\n" +
      "Sat Aug 24 13:08:46 2024 +0700\n" +
      "v1.0.1, tag: stable\n" +
      message +
      "\n";
    const actual = parseCommit(loggedCommit);

    expect(actual).toEqual({
      hash: "c6f72d62b89f82c673a3cb74e67f88f6f6b058bd",
      author: "TestAuthor",
      date: "Sat Aug 24 13:08:46 2024 +0700",
      message: "chore(repo): add pre-push",
      tags: [],
    });
  });
});
