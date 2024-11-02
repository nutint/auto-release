const isNumber = (inputString: string) => {
  if (inputString.trim().length == 0) {
    return false;
  }
  return !isNaN(Number(inputString));
};

type ExtractedJiraIssues = {
  issues: string[];
  stringWithoutIssues: () => string;
};

export const extractJiraIssues = (
  inputString: string,
  projectKeys: string[],
): ExtractedJiraIssues => {
  const words = inputString.split(/\s+/);
  const projectKeysWithPrefix = projectKeys.map(
    (projectKey) => `${projectKey}-`,
  );

  const issues = words
    .map((word) => word.replace(/[.,]/g, ""))
    .filter((word) =>
      projectKeysWithPrefix.find((projectKeyWithPrefix) => {
        return (
          word.startsWith(projectKeyWithPrefix) !== undefined &&
          isNumber(word.replace(projectKeyWithPrefix, ""))
        );
      }),
    );
  return {
    issues,
    stringWithoutIssues: () =>
      issues
        .reduce(
          (previous, currentIssue) => previous.replaceAll(currentIssue, ""),
          inputString,
        )
        .trim(),
  };
};

export type ExtractedJiraIssue = {
  issueId?: string;
  issueIdRemoved: string;
};

export const extractJiraIssue = (
  inputString: string,
  projectKey: string,
): ExtractedJiraIssue => {
  const firstWord = inputString.split(/\s+/)[0];
  if (!firstWord!.startsWith(`${projectKey}-`)) {
    return {
      issueIdRemoved: inputString.trim(),
    };
  }
  const [, digit] = firstWord!.split("-");
  if (digit !== undefined && !isNumber(digit)) {
    return {
      issueIdRemoved: inputString.trim(),
    };
  }
  const issueId = `${projectKey}-${digit}`;
  return {
    issueId,
    issueIdRemoved: inputString.replace(issueId, "").trim(),
  };
};
