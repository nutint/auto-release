import inquirer from "inquirer";

type Option<T> = {
  name: string;
  value: T;
};

export const promptOption = async <T>(
  question: string,
  options: Option<T>[],
): Promise<T> => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedOption",
      message: question,
      choices: options,
    },
  ]);
  return answer.selectedOption;
};
