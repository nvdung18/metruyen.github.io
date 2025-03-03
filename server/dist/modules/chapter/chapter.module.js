"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterModule = void 0;
const common_1 = require("@nestjs/common");
const chapter_service_1 = require("./chapter.service");
const chapter_controller_1 = require("./chapter.controller");
const sequelize_1 = require("@nestjs/sequelize");
const chapter_model_1 = require("./models/chapter.model");
const chapter_repo_1 = require("./chapter.repo");
const cloudinary_module_1 = require("../../shared/cloudinary/cloudinary.module");
const manga_module_1 = require("../manga/manga.module");
let ChapterModule = class ChapterModule {
};
exports.ChapterModule = ChapterModule;
exports.ChapterModule = ChapterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([chapter_model_1.Chapter]),
            cloudinary_module_1.CloudinaryModule,
            manga_module_1.MangaModule,
        ],
        controllers: [chapter_controller_1.ChapterController],
        providers: [chapter_service_1.ChapterService, chapter_repo_1.ChapterRepo],
        exports: [sequelize_1.SequelizeModule, chapter_service_1.ChapterService, chapter_repo_1.ChapterRepo],
    })
], ChapterModule);
//# sourceMappingURL=chapter.module.js.map