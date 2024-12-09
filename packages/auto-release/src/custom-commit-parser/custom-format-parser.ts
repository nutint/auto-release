import {
  FormatElement,
  formatSyntaxParser,
} from "@/custom-commit-parser/format-syntax-parser";
import { FormatElementName } from "@/custom-commit-parser/format-element-name";
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";

type JiraIssueExtract = {
  name: FormatElementName.JiraIssueId;
  value: string | undefined;
};

type ConventionalCommitExtract = {
  name: FormatElementName.ConventionalCommit;
  value: ConventionalCommit;
};

export type Extract = JiraIssueExtract | ConventionalCommitExtract;

export const defaultCommitFormat = "{{conventionalCommit}}";

export const customFormatParser = (
  formatElements: FormatElement[],
  commitMessage: string,
): Extract[] =>
  formatElements.reduce(
    (acc, currentFormatElement) => {
      const { extracts, remainingInput } = acc;
      const { extract, name } = currentFormatElement;
      const { value, remainingInput: remainingInputAfterExtracted } =
        extract(remainingInput);
      return {
        extracts: [...extracts, { name, value } as Extract],
        remainingInput: remainingInputAfterExtracted,
      };
    },
    {
      extracts: [] as Extract[],
      remainingInput: commitMessage,
    },
  ).extracts;
