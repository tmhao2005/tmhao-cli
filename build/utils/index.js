"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
exports.warn = (message) => {
    console.log(chalk.yellow(message));
};
exports.info = (message) => {
    console.log(chalk.green(message));
};
