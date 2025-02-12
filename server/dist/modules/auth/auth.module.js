"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_module_1 = require("../user/user.module");
const role_model_1 = require("./models/role.model");
const resource_model_1 = require("./models/resource.model");
const rolegrants_model_1 = require("./models/rolegrants.model");
const sequelize_1 = require("@nestjs/sequelize");
const keyToken_model_1 = require("./models/keyToken.model");
const auth_repo_1 = require("./auth.repo");
const jwt_1 = require("@nestjs/jwt");
const cache_module_1 = require("../../shared/cache/cache.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, auth_repo_1.AuthRepo],
        imports: [
            sequelize_1.SequelizeModule.forFeature([role_model_1.Role, resource_model_1.Resource, rolegrants_model_1.RoleGrants, keyToken_model_1.KeyToken]),
            jwt_1.JwtModule.register({
                global: true,
            }),
            user_module_1.UserModule,
            cache_module_1.CacheModule,
        ],
        exports: [sequelize_1.SequelizeModule, auth_service_1.AuthService, auth_repo_1.AuthRepo, user_module_1.UserModule, cache_module_1.CacheModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map