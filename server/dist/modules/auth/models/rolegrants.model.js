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
exports.RoleGrants = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const role_model_1 = require("./role.model");
const resource_model_1 = require("./resource.model");
let RoleGrants = class RoleGrants extends sequelize_typescript_1.Model {
};
exports.RoleGrants = RoleGrants;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => role_model_1.Role),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], RoleGrants.prototype, "grant_role", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => resource_model_1.Resource),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], RoleGrants.prototype, "grant_resource", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], RoleGrants.prototype, "grant_action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], RoleGrants.prototype, "grant_attributes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], RoleGrants.prototype, "is_deleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], RoleGrants.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], RoleGrants.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => role_model_1.Role),
    __metadata("design:type", role_model_1.Role)
], RoleGrants.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => resource_model_1.Resource),
    __metadata("design:type", resource_model_1.Resource)
], RoleGrants.prototype, "resource", void 0);
exports.RoleGrants = RoleGrants = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'rolegrants',
        timestamps: true,
    })
], RoleGrants);
//# sourceMappingURL=rolegrants.model.js.map