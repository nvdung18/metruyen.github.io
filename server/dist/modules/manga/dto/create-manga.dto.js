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
exports.CreateMangaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let CreateMangaDto = class CreateMangaDto {
};
exports.CreateMangaDto = CreateMangaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ message: 'Invalid format' }),
    __metadata("design:type", String)
], CreateMangaDto.prototype, "manga_title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ message: 'Invalid format' }),
    __metadata("design:type", String)
], CreateMangaDto.prototype, "manga_thumb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ message: 'Invalid format' }),
    __metadata("design:type", String)
], CreateMangaDto.prototype, "manga_author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], maxItems: 1 }),
    (0, class_validator_1.IsArray)({ message: 'category_id must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'category_id cannot be empty' }),
    (0, class_validator_1.IsNumber)({}, { each: true, message: 'Each category_id must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], CreateMangaDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)({ message: 'Invalid format' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMangaDto.prototype, "manga_description", void 0);
exports.CreateMangaDto = CreateMangaDto = __decorate([
    (0, swagger_1.ApiSchema)({ description: 'Description of the CreateMangaDto schema' })
], CreateMangaDto);
//# sourceMappingURL=create-manga.dto.js.map