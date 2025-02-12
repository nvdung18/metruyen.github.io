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
exports.MangaCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const manga_model_1 = require("./manga.model");
const category_model_1 = require("../../category/models/category.model");
let MangaCategory = class MangaCategory extends sequelize_typescript_1.Model {
};
exports.MangaCategory = MangaCategory;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => category_model_1.Category),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], MangaCategory.prototype, "category_id", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => manga_model_1.Manga),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], MangaCategory.prototype, "manga_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], MangaCategory.prototype, "is_deleted", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], MangaCategory.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], MangaCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => manga_model_1.Manga),
    __metadata("design:type", manga_model_1.Manga)
], MangaCategory.prototype, "manga", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => category_model_1.Category),
    __metadata("design:type", category_model_1.Category)
], MangaCategory.prototype, "category", void 0);
exports.MangaCategory = MangaCategory = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'MangaCategory', timestamps: true })
], MangaCategory);
//# sourceMappingURL=manga-category.model.js.map