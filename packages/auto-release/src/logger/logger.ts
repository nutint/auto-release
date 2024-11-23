import winston from "winston";
import { parseCommonArguments } from "@/cli/arguments/common-arguments";

export const createWinstonLogger = () => {
  const args = process.argv.slice(2);
  const { logLevel } = parseCommonArguments(args);

  const customLevels = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      http: 4,
    },
    colors: {
      error: "red",
      warn: "yellow",
      info: "blue",
      debug: "gray",
      http: "green",
    },
  };
  const winstonLogger = winston.createLogger({
    levels: logLevel !== "error" ? customLevels.levels : undefined,
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize({ all: true }),
      winston.format.simple(),
      winston.format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level.toUpperCase()}]: ${message}`,
      ),
    ),
    transports: [new winston.transports.Console()],
  });

  if (logLevel !== "error") {
    winston.addColors(customLevels.colors);
  }

  return winstonLogger;
};

export const logger = createWinstonLogger();
