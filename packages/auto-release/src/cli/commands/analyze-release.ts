import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";
import {
  extractReleaseInformation,
  printReleaseInformation,
} from "@/release-helper/release-helper";
import {
  promptCreateRelease,
  promptSelectVersion,
  promptSetupRelease,
} from "@/cli/commands/analyze-release-prompts";
import { createRelease } from "@/cli/commands/create-release";
import { OutputFormat } from "@/cli/arguments/common-arguments";

type AnalyzeOptions = {
  interactive: boolean;
  outputFormat: OutputFormat;
};

export const analyzeRelease = async (
  versionSourceConfiguration: VersionSourceConfiguration = {},
  options: AnalyzeOptions,
) => {
  const releaseInformation = await extractReleaseInformation(
    versionSourceConfiguration,
  );
  printReleaseInformation(releaseInformation, options.outputFormat);
  if (
    releaseInformation.latestTagVersion === undefined &&
    options.interactive
  ) {
    const setupReleaseAnswer = await promptSetupRelease();
    if (setupReleaseAnswer === "do-nothing") {
      return;
    }

    const selectedVersion = await promptSelectVersion({
      currentVersion: releaseInformation.currentVersion,
      calculatedVersion: releaseInformation.nextVersion,
    });

    const confirmCreateRelease = await promptCreateRelease({
      version: selectedVersion,
    });
    if (confirmCreateRelease === "yes") {
      await createRelease({ version: selectedVersion });
    }
  }
};
