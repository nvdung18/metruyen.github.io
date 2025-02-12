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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_repo_1 = require("../../modules/auth/auth.repo");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const archived_resource_decorator_1 = require("../decorators/archived-resource.decorator");
const constants_1 = require("../constants");
const auth_service_1 = require("../../modules/auth/auth.service");
const user_service_1 = require("../../modules/user/user.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, authRepo, reflector, authService, userService) {
        this.jwtService = jwtService;
        this.authRepo = authRepo;
        this.reflector = reflector;
        this.authService = authService;
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const GuestRolePermission = this.reflector.get(roles_decorator_1.GUEST_ROLE, context.getHandler()) || false;
        const isArchivedResource = this.reflector.get(archived_resource_decorator_1.ARCHIVED_RESOURCE_ACCESS, context.getHandler()) || false;
        const userId = request.headers['x-client-id'];
        if (isArchivedResource && !userId)
            throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
        if (!userId && GuestRolePermission)
            return true;
        if (!userId && !GuestRolePermission)
            throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
        const keyStore = await this.authRepo.findKeyTokenByUserId(userId);
        if (!keyStore)
            throw new common_1.HttpException('Not found Key', common_1.HttpStatus.NOT_FOUND);
        if (request.headers['x-refresh-token']) {
            try {
                const refreshToken = request.headers['x-refresh-token'];
                const decodeUser = await this.verifyJwt(refreshToken, keyStore.refresh_key);
                if (userId != decodeUser.sub)
                    throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
                request.keyStore = keyStore;
                request.user = decodeUser;
                request.refreshToken = refreshToken;
                return true;
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        const accessToken = this.extractTokenFromHeader(request);
        if (!accessToken)
            throw new common_1.UnauthorizedException();
        try {
            const decodeUser = await this.verifyJwt(accessToken, keyStore.public_key);
            if (userId != decodeUser.sub)
                throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
            if (isArchivedResource) {
                const roleSlug = await this.userService.getRoleSlugOfUser(decodeUser.sub);
                if (!(roleSlug == constants_1.RoleSlug.ADMIN)) {
                    throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
                }
            }
            request.keyStore = keyStore;
            request.user = decodeUser;
            return true;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    async verifyJwt(token, keySecret) {
        return await this.jwtService.verifyAsync(token, { secret: keySecret });
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_repo_1.AuthRepo,
        core_1.Reflector,
        auth_service_1.AuthService,
        user_service_1.UserService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map