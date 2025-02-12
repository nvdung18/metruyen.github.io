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
exports.RolesGuard = void 0;
const constants_1 = require("../constants");
const roles_decorator_1 = require("../decorators/roles.decorator");
const auth_service_1 = require("../../modules/auth/auth.service");
const user_service_1 = require("../../modules/user/user.service");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const accesscontrol_1 = require("accesscontrol");
const cache_service_1 = require("../../shared/cache/cache.service");
let RolesGuard = class RolesGuard {
    constructor(reflector, authService, userService, cacheService) {
        this.reflector = reflector;
        this.authService = authService;
        this.userService = userService;
        this.cacheService = cacheService;
        this.ac = new accesscontrol_1.AccessControl();
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.get(roles_decorator_1.ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        let grantList = await this.cacheService.get('grants_list');
        if (!grantList) {
            grantList = await this.authService.roleList();
            await this.cacheService.set('grants_list', grantList);
        }
        this.ac.setGrants(grantList);
        let role = '';
        if (req.user && req.user.sub) {
            role = await this.userService.getRoleOfUser(req.user.sub);
        }
        else {
            role = constants_1.GUEST;
            const roleName = await this.authService.getRoleByRoleSlug(constants_1.RoleSlug.USER);
            const attributesOfUserRole = this.ac
                .can(roleName)[requiredRoles['action']](requiredRoles['resource']).attributes;
            this.ac
                .grant(role)[requiredRoles['action']](requiredRoles['resource'], attributesOfUserRole);
        }
        const permission = this.ac
            .can(role)[requiredRoles['action']](requiredRoles['resource']);
        req.permission = permission;
        return permission['granted'];
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        auth_service_1.AuthService,
        user_service_1.UserService,
        cache_service_1.CacheService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map