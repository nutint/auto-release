import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";

export const processVersionFromVersionFile = async (
  params: VersionSourceConfiguration = {},
): Promise<string> => {
  const { versionFile } = params;
  return createVersionHelper(versionFile).getVersion();
};
