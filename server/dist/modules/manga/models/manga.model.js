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
exports.Manga = void 0;
const category_model_1 = require("../../category/models/category.model");
const sequelize_typescript_1 = require("sequelize-typescript");
const manga_category_model_1 = require("./manga-category.model");
let Manga = class Manga extends sequelize_typescript_1.Model {
};
exports.Manga = Manga;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Manga.prototype, "manga_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Manga.prototype, "manga_title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Manga.prototype, "manga_thumb", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Manga.prototype, "manga_slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Manga.prototype, "manga_description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Manga.prototype, "manga_author", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('ongoing'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('ongoing', 'completed', 'hiatus'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Manga.prototype, "manga_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Manga.prototype, "manga_views", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Manga.prototype, "manga_ratings_count", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Manga.prototype, "manga_total_star_rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Manga.prototype, "manga_number_of_followers", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Manga.prototype, "is_deleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Manga.prototype, "is_draft", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Manga.prototype, "is_published", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Manga.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Manga.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => category_model_1.Category, () => manga_category_model_1.MangaCategory),
    __metadata("design:type", Array)
], Manga.prototype, "categories", void 0);
exports.Manga = Manga = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'manga',
        timestamps: true,
    })
], Manga);
//# sourceMappingURL=manga.model.js.map