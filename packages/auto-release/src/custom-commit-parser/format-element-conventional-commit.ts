import { FormatElementName } from "@/custom-commit-parser/format-element-name";
import { Extractor } from "@/custom-commit-parser/extractor";
import {
  ConventionalCommit,
  parseConventionalMessage,
} from "@/conventional-commit-helper/conventional-commit-helper";

export type FormatElementConventionalCommit = {
  name: FormatElementName.ConventionalCommit;
  key: "conventionalCommit";
} & Extractor<ConventionalCommit>;

export const createFormatElementConventionalCommit =
  (): FormatElementConventionalCommit => {
    return {
      name: FormatElementName.ConventionalCommit,
      key: "conventionalCommit",
      extract: (input: string) => ({
        value: parseConventionalMessage(input),
        remainingInput: "",
      }),
    };
  };
