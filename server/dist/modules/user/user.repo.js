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
exports.UserRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("./models/user.model");
const role_model_1 = require("../auth/models/role.model");
let UserRepo = class UserRepo {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findUserByEmail(email) {
        return this.userModel.findOne({ where: { usr_email: email } });
    }
    async createNewUser(user) {
        return this.userModel.create(user.toJSON());
    }
    async getUserRoleByUserId(userId) {
        return this.userModel.findByPk(userId, {
            include: [{ model: role_model_1.Role, required: false }],
        });
    }
};
exports.UserRepo = UserRepo;
exports.UserRepo = UserRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object])
], UserRepo);
//# sourceMappingURL=user.repo.js.map