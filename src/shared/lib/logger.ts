import * as winston from "winston";
import * as path from 'path';

const isTestEnv = process.env.NODE_ENV === "test";

const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(process.cwd(), "logs", "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(process.cwd(), "logs", "combined.log") }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: 'debug',
      silent: isTestEnv
    })
  );
}

export default logger;
