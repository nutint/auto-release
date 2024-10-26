import { z } from "zod";

const commitTypesSchema = z.array(
  z.enum([
    "feat",
    "fix",
    "BREAKING CHANGE",
    "build",
    "chore",
    "ci",
    "docs",
    "style",
    "refactor",
    "perf",
    "test",
  ]),
);

export const versionRulesSchema = z.object({
  major: commitTypesSchema,
  minor: commitTypesSchema,
  patch: commitTypesSchema,
});

export type VersionRulesConfiguration = {
  major: CommitTypes[];
  minor: CommitTypes[];
  patch: CommitTypes[];
};

export type CommitTypes =
  | "feat"
  | "fix"
  | "BREAKING CHANGE"
  | "build"
  | "chore"
  | "ci"
  | "docs"
  | "style"
  | "refactor"
  | "perf"
  | "test";
