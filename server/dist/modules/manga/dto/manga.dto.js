"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const manga_model_1 = require("../models/manga.model");
class MangaDto extends (0, swagger_1.PartialType)(manga_model_1.Manga) {
}
exports.MangaDto = MangaDto;
//# sourceMappingURL=manga.dto.js.map