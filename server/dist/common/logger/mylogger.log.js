"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logging = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
class Logging {
    constructor() {
        this.myFormat = null;
        this.createLoggerConfig = null;
        this.logger = null;
        this.myFormat = winston_1.format.printf(({ level = 'info', message, timestamp, context, refCode, err, statusCode, metadata, option, }) => {
            let msg = `${timestamp} - ${level} - ${context} - ${refCode} - ${message} - ${JSON.stringify(metadata) || statusCode}${!option ? '' : ' - ' + option}`;
            if (err) {
                msg += ' - ' + err.stack || err;
            }
            return msg;
        });
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }), this.myFormat),
            transports: [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.colorize({ all: true }), this.myFormat),
                }),
                new winston_daily_rotate_file_1.default({
                    level: 'error',
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '1d',
                }),
                new winston_daily_rotate_file_1.default({
                    level: 'info',
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '1d',
                }),
            ],
        });
    }
    getLogger() {
        return this.logger;
    }
}
exports.Logging = Logging;
//# sourceMappingURL=mylogger.log.js.map