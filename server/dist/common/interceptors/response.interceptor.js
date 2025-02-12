"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const date_fns_1 = require("date-fns");
const core_1 = require("@nestjs/core");
const response_message_decorator_1 = require("../decorators/response-message.decorator");
const uuid_1 = require("uuid");
const mylogger_log_1 = require("../logger/mylogger.log");
const util_service_1 = __importDefault(require("../services/util.service"));
let ResponseInterceptor = class ResponseInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
        this.logger = new mylogger_log_1.Logging().getLogger();
        this.util = new util_service_1.default();
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'];
        request.requestId = requestId ? requestId : (0, uuid_1.v4)();
        this.logger.log({
            level: 'info',
            context: request.path,
            message: `input params ::${request.method}`,
            refCode: request.requestId,
            metadata: request.method === 'POST' ? request.body : request.query,
        });
        return next.handle().pipe((0, operators_1.map)((res) => this.responseHandler(res, context)), (0, operators_1.catchError)((err) => {
            if (err instanceof common_1.HttpException) {
                return (0, rxjs_1.throwError)(() => this.errorHandler(err, context));
            }
            else {
                return (0, rxjs_1.throwError)(() => err);
            }
        }));
    }
    errorHandler(exception, context) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'];
        request.requestId = requestId ? requestId : (0, uuid_1.v4)();
        this.logger.error({
            level: 'error',
            message: exception.message ? exception.message : response,
            err: exception,
            context: request.path,
            refCode: request.requestId,
            statusCode: exception.getStatus() || 500,
        });
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            status: false,
            statusCode: status,
            path: request.url,
            message: exception.message,
            result: process.env.NODE_ENV === 'production'
                ? 'An error occurred'
                : this.util.formatStackTrace(exception.stack || exception),
            option: {},
            timestamp: (0, date_fns_1.format)(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        });
    }
    responseHandler(res, context) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = response.statusCode;
        const statusReason = common_1.HttpStatus[statusCode] || 'Unknown Status';
        const message = this.reflector.get(response_message_decorator_1.RESPONSE_MESSAGE_METADATA, context.getHandler()) || 'success';
        return {
            status: true,
            path: request.url,
            statusCode,
            statusReason,
            message: message,
            metadata: res.metadata,
            option: res.option || {},
            timestamp: (0, date_fns_1.format)(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        };
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map