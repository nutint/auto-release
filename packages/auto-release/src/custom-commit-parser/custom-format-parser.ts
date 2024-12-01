import { formatSyntaxParser } from "@/custom-commit-parser/format-syntax-parser";

export const customFormatParser = (format: string, commitMessage: string) =>
  formatSyntaxParser(format).reduce(
    (acc, currentFormatElement) => {
      const { parsed, remainingInput } = acc;
      const { extract, key } = currentFormatElement;
      const { value, remainingInput: remainingInputAfterExtracted } =
        extract(remainingInput);
      return {
        parsed: {
          ...parsed,
          [key]: value,
        },
        remainingInput: remainingInputAfterExtracted,
      };
    },
    {
      parsed: {},
      remainingInput: commitMessage,
    },
  ).parsed;
