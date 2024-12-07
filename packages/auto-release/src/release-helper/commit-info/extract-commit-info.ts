import { Extract } from "@/custom-commit-parser/custom-format-parser";
import { FormatElementName } from "@/custom-commit-parser/format-element-name";

type CommitInfo = {
  type?: string;
  subject: string;
  scope?: string;
  breakingChange: boolean;
  jiraIssueId: string;
};

export const extractCommitInfo = (extracts: Extract[]): CommitInfo => {
  if (extracts.length == 0) {
    throw new ExtractCommitInfoError("no information provided");
  }
  const extracted = extracts.reduce((extractedInfo, current) => {
    if (current.name === FormatElementName.JiraIssueId) {
      return {
        ...extractedInfo,
        jiraIssueId: current.value,
      };
    }
    const { type, subject, scope, notes } = current.value;
    return {
      ...extractedInfo,
      type,
      subject,
      scope,
      breakingChange:
        notes.find(({ title }) => title === "BREAKING CHANGE") !== undefined,
    };
  }, {} as object);

  if (!("subject" in extracted)) {
    throw new ExtractCommitInfoError("missing commit subject");
  }
  return extracted as CommitInfo;
};

export class ExtractCommitInfoError extends Error {
  constructor(message: string) {
    super(`ExtractCommitInfoError: ${message}`);
  }
}
