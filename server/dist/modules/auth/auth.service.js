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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_js_1 = __importDefault(require("crypto-js"));
const auth_repo_1 = require("./auth.repo");
const user_repo_1 = require("../user/user.repo");
const bcrypt_1 = require("bcrypt");
const util_service_1 = __importDefault(require("../../common/services/util.service"));
const lodash_1 = __importDefault(require("lodash"));
let AuthService = class AuthService {
    constructor(jwtService, userRepo, authRepo, util) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.authRepo = authRepo;
        this.util = util;
    }
    async signIn(data) {
        const foundUser = await this.userRepo.findUserByEmail(data.usr_email);
        if (!foundUser)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.UNAUTHORIZED);
        const matchPassword = await (0, bcrypt_1.compare)(data.usr_password, foundUser.usr_password);
        if (!matchPassword)
            throw new common_1.HttpException('Invalid password', common_1.HttpStatus.UNAUTHORIZED);
        const { keyForAccessToken, keyForRefreshToken } = this.createKeyForAccessAndRefreshToken();
        const payload = { sub: foundUser.usr_id, email: foundUser.usr_email };
        const { accessToken, refreshToken } = await this.createKeyTokenPair(payload, keyForAccessToken, keyForRefreshToken);
        const updatedData = {
            user_id: foundUser.usr_id,
            public_key: keyForAccessToken,
            refresh_key: keyForRefreshToken,
            refresh_token: refreshToken,
        };
        if (!(await this.authRepo.findKeyTokenByUserId(foundUser.usr_id))) {
            const keyTokenId = this.util.generateIdByTime();
            updatedData.id = keyTokenId;
        }
        const isUpdateKey = this.authRepo.updateOrCreateKeyTokenByUserId(updatedData);
        if (!isUpdateKey)
            throw new common_1.HttpException('Failed to update key token', common_1.HttpStatus.BAD_REQUEST);
        return {
            user: this.util.getInfoData({
                fields: ['usr_id', 'usr_name', 'usr_email'],
                object: foundUser,
            }),
            token: { access_token: accessToken, refresh_token: refreshToken },
        };
    }
    async logout(keyStore) {
        const delKey = await this.authRepo.deleteKeyTokenById(keyStore.id);
        return delKey;
    }
    async handleRefreshToken(refreshToken, user, keyStore) {
        const { sub: userId, email } = user;
        const refreshTokensUsed = keyStore.refresh_tokens_used
            ? keyStore.refresh_tokens_used
            : [];
        if (refreshTokensUsed.includes(refreshToken)) {
            this.authRepo.deleteKeyTokenByUserId(userId);
            throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.FORBIDDEN);
        }
        if (keyStore.refresh_token != refreshToken) {
            throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.UNAUTHORIZED);
        }
        const payload = { sub: userId, email: email };
        const { accessToken: access_token, refreshToken: refresh_token } = await this.createKeyTokenPair(payload, keyStore.public_key, keyStore.refresh_key);
        refreshTokensUsed.push(refreshToken);
        const isUpdated = this.authRepo.updateRefreshTokenUsedByUserId(userId, refresh_token, refreshTokensUsed);
        if (!isUpdated)
            throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.UNAUTHORIZED);
        return {
            user: { userId, email },
            token: { access_token, refresh_token },
        };
    }
    async createKeyTokenPair(payload, keyForAccessToken, keyForRefreshToken) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: keyForAccessToken,
            expiresIn: '2 days',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: keyForRefreshToken,
            expiresIn: '7 days',
        });
        return { accessToken, refreshToken };
    }
    createKeyForAccessAndRefreshToken() {
        const keyForAccessToken = crypto_js_1.default.lib.WordArray.random(64).toString(crypto_js_1.default.enc.Hex);
        const keyForRefreshToken = crypto_js_1.default.lib.WordArray.random(64).toString(crypto_js_1.default.enc.Hex);
        return { keyForAccessToken, keyForRefreshToken };
    }
    async roleList() {
        const roleGrants = await this.authRepo.getAllRoleGrants();
        const grantList = lodash_1.default.flatMap(roleGrants, (grant) => {
            const actions = lodash_1.default.castArray(grant.grant_action);
            return lodash_1.default.map(actions, (action) => ({
                role: grant.role.role_name,
                resource: grant.resource.src_name,
                action,
                attributes: grant.grant_attributes,
            }));
        });
        return grantList;
    }
    async getRoleByRoleSlug(roleSlug) {
        const role = await this.authRepo.getRoleByRoleSlug(roleSlug);
        return role.role_name;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_repo_1.UserRepo,
        auth_repo_1.AuthRepo,
        util_service_1.default])
], AuthService);
//# sourceMappingURL=auth.service.js.map