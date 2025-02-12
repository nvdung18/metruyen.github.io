import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class DatabaseExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    private util;
    constructor();
    catch(exception: any, host: ArgumentsHost): void;
}
