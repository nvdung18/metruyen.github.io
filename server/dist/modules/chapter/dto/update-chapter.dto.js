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
exports.UpdateChapterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_chapter_dto_1 = require("./create-chapter.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateChapterDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_chapter_dto_1.CreateChapterDto, ['chap_content'])) {
}
exports.UpdateChapterDto = UpdateChapterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Array containing page numbers will be changed.`,
        type: [Number],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value.length)
            return [];
        else if (typeof value === 'string') {
            return value.split(',').map(Number);
        }
        else if (Array.isArray(value)) {
            return value.map(Number);
        }
        return value;
    }),
    (0, class_validator_1.IsArray)({ message: 'chap_img_pages must be an array' }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateChapterDto.prototype, "chap_img_pages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Array containing image will change.
    "**chap_img_pages**" have to equal with "**chap_content**"
    and "**chap_img_pages**" will corresponding with "**chap_content**`,
        type: 'array',
        items: { type: 'string', format: 'binary' },
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateChapterDto.prototype, "chap_content", void 0);
//# sourceMappingURL=update-chapter.dto.js.map