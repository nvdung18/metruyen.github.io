import { NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export type Response<T> = {
    status: boolean;
    statusCode: number;
    path: string;
    message: string;
    metadata: T;
    option: object;
    timestamp: string;
};
export declare class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private reflector;
    private readonly logger;
    private util;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
    errorHandler(exception: HttpException, context: ExecutionContext): void;
    responseHandler(res: any, context: ExecutionContext): {
        status: boolean;
        path: any;
        statusCode: any;
        statusReason: string;
        message: string;
        metadata: any;
        option: any;
        timestamp: string;
    };
}
