import { promptOption } from "@/cli/prompts";

export const promptSetupRelease = async () => {
  return await promptOption(
    "No git tag has been set up, you can still go for first release or set up first release",
    [
      {
        name: "Do nothing for now, I will do the release with the first commit from this repository",
        value: "do-nothing",
      },
      {
        name: "I want to set up first release",
        value: "setup-first-release",
      },
    ],
  );
};

type PromptSelectVersionParams = {
  currentVersion: string;
  calculatedVersion: string;
};

export const promptSelectVersion = async ({
  currentVersion,
  calculatedVersion,
}: PromptSelectVersionParams) => {
  return await promptOption(
    "Please choose the following version to create release",
    [
      {
        name: `${currentVersion} (current version from project file)`,
        value: currentVersion,
      },
      {
        name: `${calculatedVersion} (calculated version based on changes)`,
        value: calculatedVersion,
      },
    ],
  );
};

type PromptCreateReleaseParams = {
  version: string;
};
export const promptCreateRelease = async ({
  version,
}: PromptCreateReleaseParams) => {
  return await promptOption(
    `Do you want to create release for version ${version} now?`,
    [
      {
        name: "Yes",
        value: "yes",
      },
      {
        name: "No",
        value: "no",
      },
    ],
  );
};
