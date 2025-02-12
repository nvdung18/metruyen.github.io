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
exports.PaginatedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
class PaginatedDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.PaginatedDto = PaginatedDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    __metadata("design:type", Number)
], PaginatedDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Number)
], PaginatedDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], PaginatedDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Number)
], PaginatedDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Number)
], PaginatedDto.prototype, "totalPages", void 0);
//# sourceMappingURL=paginate.dto.js.map