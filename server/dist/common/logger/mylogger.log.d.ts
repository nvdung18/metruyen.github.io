import { Logform, LoggerOptions, Logger } from 'winston';
export declare class Logging {
    myFormat: Logform.Format;
    createLoggerConfig: LoggerOptions;
    logger: Logger;
    constructor();
    getLogger(): Logger;
}
