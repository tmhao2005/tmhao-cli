import * as chalk from "chalk";

export const warn = (message: string) => {
  console.log(chalk.yellow(message));
};

export const info = (message: string) => {
  console.log(chalk.green(message));
};
