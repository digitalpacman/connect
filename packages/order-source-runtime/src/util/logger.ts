import { format, LoggerOptions, transports, createLogger } from "winston";
import { getTransactionId } from "./storage";
import { TransformableInfo } from "logform";
import * as redact from "fast-redact";
import { serializeError } from "serialize-error";

const LOG_LEVEL = "debug";
const LOG_FORMAT = process.env.NODE_ENV === "production" ? "json" : "console";

const redactor = redact({
  paths: ["request.headers.authorization", "request.body.metadata.*", "response.body.metadata.*"],
});

const redactBody = format((info, opts) => {
  if (info && info.meta) {
    info.meta = JSON.parse(redactor(info.meta));
  }
  return info;
});

const attachTransactionId = format((info) => {
  info.transactionId = getTransactionId();

  return info;
});

const jsonOptions: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    format.metadata(),
    redactBody(),
    attachTransactionId(),
    format.json()
  ),
  transports: [new transports.Console({ level: LOG_LEVEL })],
};

function print(msg: any): string {
  if (typeof msg === "string") {
    return msg;
  } else if (msg instanceof Error) {
  } else if (msg && Object.keys(msg).length > 0) {
    /*
     * We run serializeError on arbitrary objects here because we can't tell the
     * difference between SDK errors and other objects, and the serializer is a
     * pass-through for objects that aren't errors.
     */
    return JSON.stringify(serializeError(msg));
  }
  return "";
}

const debugPrint = (info: TransformableInfo) => {
  const metadata = info.metadata;
  const transactionId = info.transactionId?.slice(0, 8) ?? "";
  const timestamp = metadata?.timestamp.slice(11) ?? "";
  const metadataCopy = { ...metadata };
  delete metadataCopy.timestamp;

  return `${timestamp} ${transactionId} ${info.level}: ${print(info.message)} ${print(
    metadataCopy
  )}`;
};

const consoleOptions: LoggerOptions = {
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.metadata(),
    attachTransactionId(),
    format.printf(debugPrint)
  ),
  transports: [new transports.Console({ level: LOG_LEVEL })],
};

const logJson = LOG_FORMAT === "json";

const logger = createLogger(logJson ? jsonOptions : consoleOptions);

logger.info(`Logging initialized with ${logger.level} level and ${logJson ? "json" : "console"}`);

export default logger;
