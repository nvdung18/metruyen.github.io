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
exports.SearchMangaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_manga_dto_1 = require("./update-manga.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const only_one_field_validator_1 = require("../../../shared/dto/only-one-field.validator");
class SearchMangaDto {
}
exports.SearchMangaDto = SearchMangaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: update_manga_dto_1.MangaStatus,
        description: 'The status of the manga',
    }),
    (0, class_validator_1.IsEnum)(update_manga_dto_1.MangaStatus, { message: 'Invalid manga status' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMangaDto.prototype, "manga_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Manga category id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchMangaDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Search manga by keyword',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchMangaDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'New updated',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchMangaDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'New created',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchMangaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Sort by views',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchMangaDto.prototype, "manga_views", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Sort by top follows',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchMangaDto.prototype, "manga_number_of_followers", void 0);
__decorate([
    (0, class_validator_1.ValidateBy)({
        name: 'OnlyOneSortField',
        validator: only_one_field_validator_1.OnlyOneFieldValidator,
        constraints: [
            'updatedAt',
            'createdAt',
            'manga_views',
            'manga_number_of_followers',
        ],
    }),
    __metadata("design:type", Boolean)
], SearchMangaDto.prototype, "validateSortFields", void 0);
//# sourceMappingURL=search-manga.dto.js.map