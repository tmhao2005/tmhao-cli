import chalk from "chalk";

function addBL(message: string) {
  return `${message}\n`;
}

export function warn(..._args: any[]) {
  const [message, ...rest] = arguments;
  console.log(chalk.yellow(addBL(message)), ...rest);
}

export function log(..._args: any[]) {
  const [message, ...rest] = arguments;
  console.log(addBL(message), ...rest);
}

export function success(..._args: any[]) {
  const [message, ...rest] = arguments;
  console.log(chalk.greenBright(addBL(message)), ...rest);
}

export function red(..._args: any[]) {
  const [message, ...rest] = arguments;
  console.log(chalk.red(addBL(message)), ...rest);
}
