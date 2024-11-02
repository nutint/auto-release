const isNumber = (inputString: string) => {
  if (inputString.trim().length == 0) {
    return false;
  }
  return !isNaN(Number(inputString));
};

export const extractJiraIssues = (
  inputString: string,
  projectKeys: string[],
) => {
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
