export class InvalidGitLogCommitFormat extends Error {
  constructor(message: string) {
    super(`InvalidGitLogCommitFormat: ${message}`);
  }
}

export const parseCommit = (commitLogString: string) => {
  const lines = commitLogString.split("\n");
  const hash = lines[0];
  const author = lines[1];
  const date = lines[2];
  const tagsLine = lines[3];
  const tags =
    tagsLine === undefined
      ? []
      : tagsLine.startsWith("tag:")
        ? tagsLine.split(", ").map((tag) => tag.replace("tag: ", ""))
        : [];
  const message = lines.slice(4).join("\n").trim();

  if (lines.length < 5) {
    throw new InvalidGitLogCommitFormat("Empty commit message");
  }

  return {
    hash,
    author,
    date,
    message,
    tags,
  };
};
