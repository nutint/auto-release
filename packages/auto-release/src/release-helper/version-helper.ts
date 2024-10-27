export type IVersionHelper = {
  getVersion: () => { packageVersion: string; latestGitTag: string };
  versionFileType: SupportVersionFile;
};

export const createVersionHelper = (versionFile: string): IVersionHelper => {
  const supportedVersionFile = supportedVersionFiles.find((file) =>
    versionFile.endsWith(file),
  );
  if (supportedVersionFile === undefined) {
    throw new VersionHelperError("unsupported version file");
  }
  return {
    getVersion: () => ({
      packageVersion: "1.0.1",
      latestGitTag: "1.0.1",
    }),
    versionFileType: "package.json",
  };
};

export class VersionHelperError extends Error {
  constructor(reason: string) {
    super(`Version helper error: ${reason}`);
  }
}

type SupportVersionFile = "package.json" | "build.sbt";

export const supportedVersionFiles: SupportVersionFile[] = ["package.json"];
