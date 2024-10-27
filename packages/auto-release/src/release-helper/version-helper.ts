export const createVersionHelper = (versionFile: string) => {
  return {
    getVersion: () => ({
      packageVersion: "1.0.1",
      latestGitTag: "1.0.1",
    }),
  };
};
