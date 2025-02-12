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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const user_model_1 = require("./models/user.model");
const user_repo_1 = require("./user.repo");
const auth_repo_1 = require("../auth/auth.repo");
const util_service_1 = __importDefault(require("../../common/services/util.service"));
const auth_service_1 = require("../auth/auth.service");
const favorite_repo_1 = require("../favorite/favorite.repo");
const favorite_model_1 = require("../favorite/models/favorite.model");
let UserService = class UserService {
    constructor(userRepo, util, authService, authRepo, favoriteRepo) {
        this.userRepo = userRepo;
        this.util = util;
        this.authService = authService;
        this.authRepo = authRepo;
        this.favoriteRepo = favoriteRepo;
    }
    async create(createUserDto) {
        const user = await this.userRepo.findUserByEmail(createUserDto.usr_email);
        if (user) {
            throw new common_1.HttpException('User already registered! ', common_1.HttpStatus.BAD_REQUEST);
        }
        const passwordHash = await (0, bcrypt_1.hash)(createUserDto.usr_password, 10);
        createUserDto.usr_password = passwordHash;
        const userId = this.util.generateIdByTime();
        const userSlug = this.util.generateSlug([
            createUserDto.usr_name,
            Math.floor(userId / 1000).toString(),
        ]);
        const newUser = await this.userRepo.createNewUser(new user_model_1.User({
            usr_id: userId,
            usr_slug: userSlug,
            usr_role: 1,
            ...createUserDto,
        }));
        if (newUser) {
            const { keyForAccessToken, keyForRefreshToken } = this.authService.createKeyForAccessAndRefreshToken();
            const payload = { sub: newUser.usr_id, email: newUser.usr_email };
            const { accessToken, refreshToken } = await this.authService.createKeyTokenPair(payload, keyForAccessToken, keyForRefreshToken);
            const keyStore = await this.authRepo.createKeyToken({
                id: this.util.generateIdByTime(),
                user_id: newUser.usr_id,
                refresh_key: keyForRefreshToken,
                public_key: keyForAccessToken,
                refresh_token: refreshToken,
            });
            if (!keyStore)
                throw new common_1.HttpException('Cannot create key token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            const favoriteId = this.util.generateIdByTime({ fitWithInteger: true });
            await this.favoriteRepo.createFavoriteStorage(new favorite_model_1.Favorite({
                fav_id: favoriteId,
                fav_user_id: newUser.usr_id,
            }));
            return {
                user: this.util.getInfoData({
                    fields: ['usr_id', 'usr_name', 'usr_email'],
                    object: newUser,
                }),
                tokens: { accessToken, refreshToken },
            };
        }
        throw new common_1.HttpException('User not created', common_1.HttpStatus.BAD_REQUEST);
    }
    async getRoleOfUser(userId) {
        const user = await this.userRepo.getUserRoleByUserId(userId);
        return user.role.role_name;
    }
    async getRoleSlugOfUser(userId) {
        const user = await this.userRepo.getUserRoleByUserId(userId);
        return user.role.role_slug;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_1.UserRepo,
        util_service_1.default,
        auth_service_1.AuthService,
        auth_repo_1.AuthRepo,
        favorite_repo_1.FavoriteRepo])
], UserService);
//# sourceMappingURL=user.service.js.map