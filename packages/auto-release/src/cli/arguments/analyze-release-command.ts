export type AnalyzeRelease = {
  command: "AnalyzeRelease";
};

export const parseAnalyzeReleaseCommand = (): AnalyzeRelease => ({
  command: "AnalyzeRelease",
});
