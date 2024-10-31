// @ts-ignore
import { CommitParser } from "conventional-commits-parser";

import { InvalidGitLogCommitFormat } from "@/commit-parser/parse-commit";

export type ConventionalCommit = {
  header: string;
  body?: string;
  footer?: string;
  notes: { title: string; text: string }[];
  type: string;
  scope?: string;
  subject: string;
};

export const parseConventionalMessage = (
  commitMessage: string,
): ConventionalCommit => {
  if (commitMessage.trim().length === 0) {
    throw new InvalidGitLogCommitFormat("Empty commit message");
  }
  const parser = new CommitParser();
  const { header, body, footer, notes, type, scope, subject } =
    parser.parse(commitMessage);

  if (
    header === null ||
    header === undefined ||
    type === null ||
    type === undefined ||
    subject === null ||
    subject === undefined
  ) {
    throw new InvalidGitLogCommitFormat(
      "Invalid commit type required subject and valid commit type",
    );
  }
  return {
    header,
    body: body ?? undefined,
    footer: footer ?? undefined,
    notes,
    type,
    scope,
    subject,
  };
};
