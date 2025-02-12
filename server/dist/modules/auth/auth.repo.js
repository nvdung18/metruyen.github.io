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
exports.AuthRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const keyToken_model_1 = require("./models/keyToken.model");
const rolegrants_model_1 = require("./models/rolegrants.model");
const role_model_1 = require("./models/role.model");
const resource_model_1 = require("./models/resource.model");
let AuthRepo = class AuthRepo {
    constructor(keyTokenModel, roleGrantsModel, roleModel, resourceModel) {
        this.keyTokenModel = keyTokenModel;
        this.roleGrantsModel = roleGrantsModel;
        this.roleModel = roleModel;
        this.resourceModel = resourceModel;
    }
    async createKeyToken({ id, user_id, refresh_key, public_key, refresh_token, }) {
        try {
            return await this.keyTokenModel.create({
                id,
                user_id,
                refresh_key,
                public_key,
                refresh_token,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateOrCreateKeyTokenByUserId({ id, user_id, refresh_key, public_key, refresh_token, }, option = { returning: true }) {
        const upsertData = {
            user_id,
            refresh_key,
            public_key,
            refresh_token,
        };
        if (id) {
            upsertData.id = id;
        }
        const token = await this.keyTokenModel.upsert(upsertData, option);
        return token;
    }
    async findKeyTokenByUserId(user_id) {
        return await this.keyTokenModel.findOne({
            where: { user_id },
        });
    }
    async deleteKeyTokenByUserId(user_id) {
        return await this.keyTokenModel.destroy({ where: { user_id } });
    }
    async deleteKeyTokenById(id) {
        return await this.keyTokenModel.destroy({ where: { id } });
    }
    async updateRefreshTokenUsedByUserId(user_id, refresh_token, refresh_tokens_used) {
        const [affectedCount] = await this.keyTokenModel.update({
            refresh_token,
            refresh_tokens_used,
        }, { where: { user_id: user_id }, returning: true });
        return affectedCount;
    }
    async getAllRoleGrants() {
        const roleGrants = await this.roleGrantsModel.findAll({
            include: [
                {
                    model: role_model_1.Role,
                    required: false,
                },
                {
                    model: resource_model_1.Resource,
                    required: false,
                },
            ],
        });
        return roleGrants;
    }
    async getRoleByRoleSlug(roleSlug) {
        return await this.roleModel.findOne({
            where: { role_slug: roleSlug },
        });
    }
};
exports.AuthRepo = AuthRepo;
exports.AuthRepo = AuthRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(keyToken_model_1.KeyToken)),
    __param(1, (0, sequelize_1.InjectModel)(rolegrants_model_1.RoleGrants)),
    __param(2, (0, sequelize_1.InjectModel)(role_model_1.Role)),
    __param(3, (0, sequelize_1.InjectModel)(resource_model_1.Resource)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AuthRepo);
//# sourceMappingURL=auth.repo.js.map