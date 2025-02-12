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
exports.Role = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("../../user/models/user.model");
const resource_model_1 = require("./resource.model");
const rolegrants_model_1 = require("./rolegrants.model");
let Role = class Role extends sequelize_typescript_1.Model {
};
exports.Role = Role;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Role.prototype, "role_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
        unique: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "role_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    }),
    __metadata("design:type", String)
], Role.prototype, "role_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "role_description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "role_slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Role.prototype, "is_deleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_model_1.User),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => resource_model_1.Resource, () => rolegrants_model_1.RoleGrants),
    __metadata("design:type", Array)
], Role.prototype, "resources", void 0);
exports.Role = Role = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'roles',
        timestamps: true,
    })
], Role);
//# sourceMappingURL=role.model.js.map