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
exports.FavoriteDetail = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const favorite_model_1 = require("./favorite.model");
const manga_model_1 = require("../../manga/models/manga.model");
let FavoriteDetail = class FavoriteDetail extends sequelize_typescript_1.Model {
};
exports.FavoriteDetail = FavoriteDetail;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => manga_model_1.Manga),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], FavoriteDetail.prototype, "manga_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => manga_model_1.Manga),
    __metadata("design:type", manga_model_1.Manga)
], FavoriteDetail.prototype, "manga", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => favorite_model_1.Favorite),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], FavoriteDetail.prototype, "fav_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => favorite_model_1.Favorite),
    __metadata("design:type", favorite_model_1.Favorite)
], FavoriteDetail.prototype, "favorite", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], FavoriteDetail.prototype, "is_deleted", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], FavoriteDetail.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], FavoriteDetail.prototype, "updatedAt", void 0);
exports.FavoriteDetail = FavoriteDetail = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'FavoriteDetails',
        timestamps: true,
    })
], FavoriteDetail);
//# sourceMappingURL=favorite-details.model.js.map