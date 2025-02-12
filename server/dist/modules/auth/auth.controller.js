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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const sign_in_dto_1 = require("./dto/sign-in.dto");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const cache_service_1 = require("../../shared/cache/cache.service");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
let AuthController = class AuthController {
    constructor(authService, cacheService) {
        this.authService = authService;
        this.cacheService = cacheService;
    }
    async signIn(signInDto) {
        return {
            metadata: await this.authService.signIn(signInDto),
        };
    }
    async logout(req) {
        return {
            metadata: await this.authService.logout(req['keyStore']),
        };
    }
    async AuthToken(req) {
        return {
            metadata: req['user'],
        };
    }
    async handleRefreshToken(req) {
        return {
            metadata: await this.authService.handleRefreshToken(req['refreshToken'], req['user'], req['keyStore']),
        };
    }
    async authRole(req) {
        return {
            metadata: 'You can access this resource',
        };
    }
    async testCache() {
        const cacheKey = 'key';
        let data = '';
        data = await this.cacheService.get(cacheKey);
        if (!data) {
            await this.cacheService.set(cacheKey, data, '1m');
        }
        return {
            metadata: {
                data,
            },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User & Admin login',
        description: `
  - **${constants_1.SwaggerApiOperation.NOT_REQUIRE_CLIENT_ID}**
  - Return some **specific information**, **access token** & **refresh token**
    `,
    }),
    (0, swagger_1.ApiBody)({
        type: sign_in_dto_1.SignInDto,
        description: `
  - In the Examples have two type account of **normal user** and **admin**
  - You can use directly the **Examples** below to test
    `,
        examples: {
            admin: {
                value: {
                    usr_email: 'admin123@gmail.com',
                    usr_password: 'admin123',
                },
            },
            user: {
                value: {
                    usr_email: 'user123@example.com',
                    usr_password: 'user123',
                },
            },
        },
    }),
    (0, common_1.HttpCode)(200),
    (0, response_message_decorator_1.ResponseMessage)('User signed in successfully'),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User & Admin logout',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - **Delete** all key and token of user (include '**public key**', '**refresh key**', '**refresh token**')
    `,
    }),
    (0, common_1.HttpCode)(200),
    (0, response_message_decorator_1.ResponseMessage)('Logout success'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User & Admin authentication tokens',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - This route use to test verify token.
    `,
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, response_message_decorator_1.ResponseMessage)('Verify Token successfully'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('auth-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "AuthToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User & Admin handle refresh token',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - This route use to **verify refresh token**, then **provide new access token**.
  - **Delete** all key and token of user if **refresh token has been used**.
    `,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-refresh-token',
        required: true,
        description: 'Set you refresh token',
    }),
    (0, common_1.HttpCode)(200),
    (0, response_message_decorator_1.ResponseMessage)('Handle refresh token successfully'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('handle-refresh-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleRefreshToken", null);
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.HttpCode)(200),
    (0, response_message_decorator_1.ResponseMessage)('Test Auth Role Successfully '),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.GuestRole)(true),
    (0, roles_decorator_1.Roles)({ action: 'readAny', resource: 'Category' }),
    (0, common_1.Get)('test-auth-role'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authRole", null);
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.HttpCode)(200),
    (0, response_message_decorator_1.ResponseMessage)('Get cache successfully'),
    (0, common_1.Get)('test-cache'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testCache", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        cache_service_1.CacheService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map