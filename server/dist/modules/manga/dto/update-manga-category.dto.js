"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMangaCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_manga_dto_1 = require("./create-manga.dto");
class UpdateMangaCategoryDto extends (0, swagger_1.PickType)(create_manga_dto_1.CreateMangaDto, [
    'category_id',
]) {
}
exports.UpdateMangaCategoryDto = UpdateMangaCategoryDto;
//# sourceMappingURL=update-manga-category.dto.js.map