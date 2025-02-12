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
exports.DatabaseExceptionsFilter = void 0;
const mylogger_log_1 = require("../logger/mylogger.log");
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const util_service_1 = __importDefault(require("../services/util.service"));
const date_fns_1 = require("date-fns");
let DatabaseExceptionsFilter = class DatabaseExceptionsFilter {
    constructor() {
        this.logger = new mylogger_log_1.Logging().getLogger();
        this.util = new util_service_1.default();
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message || 'A database error occurred';
        const requestId = request.headers['x-request-id'];
        request.requestId = requestId ? requestId : (0, uuid_1.v4)();
        this.logger.error({
            level: 'error',
            message: `${message}::[${exception.name}]`,
            err: exception,
            context: request.path,
            refCode: request.requestId,
            statusCode: status,
            option: '',
        });
        response.status(status).json({
            status: false,
            statusCode: status,
            path: request.url,
            message: `${message}::[${exception.name}]`,
            result: process.env.NODE_ENV === 'production'
                ? 'An error occurred'
                : this.util.formatStackTrace(exception.stack || exception),
            timestamp: (0, date_fns_1.format)(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        });
    }
};
exports.DatabaseExceptionsFilter = DatabaseExceptionsFilter;
exports.DatabaseExceptionsFilter = DatabaseExceptionsFilter = __decorate([
    (0, common_1.Catch)(sequelize_1.BaseError),
    __metadata("design:paramtypes", [])
], DatabaseExceptionsFilter);
//# sourceMappingURL=db.exception.js.map