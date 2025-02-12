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
exports.UpdateMangaDto = exports.MangaStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_manga_dto_1 = require("./create-manga.dto");
const class_validator_1 = require("class-validator");
var MangaStatus;
(function (MangaStatus) {
    MangaStatus["ONGOING"] = "ongoing";
    MangaStatus["COMPLETED"] = "completed";
    MangaStatus["HIATUS"] = "hiatus";
})(MangaStatus || (exports.MangaStatus = MangaStatus = {}));
class UpdateMangaDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_manga_dto_1.CreateMangaDto, ['category_id'])) {
}
exports.UpdateMangaDto = UpdateMangaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: MangaStatus,
        description: 'The status of the manga',
        example: MangaStatus.ONGOING,
    }),
    (0, class_validator_1.IsEnum)(MangaStatus, { message: 'Invalid manga status' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMangaDto.prototype, "manga_status", void 0);
//# sourceMappingURL=update-manga.dto.js.map