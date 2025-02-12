"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaModule = void 0;
const common_1 = require("@nestjs/common");
const manga_service_1 = require("./manga.service");
const manga_controller_1 = require("./manga.controller");
const sequelize_1 = require("@nestjs/sequelize");
const manga_model_1 = require("./models/manga.model");
const manga_repo_1 = require("./manga.repo");
const manga_category_model_1 = require("./models/manga-category.model");
let MangaModule = class MangaModule {
};
exports.MangaModule = MangaModule;
exports.MangaModule = MangaModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([manga_model_1.Manga, manga_category_model_1.MangaCategory])],
        controllers: [manga_controller_1.MangaController],
        providers: [manga_service_1.MangaService, manga_repo_1.MangaRepo],
        exports: [manga_service_1.MangaService, manga_repo_1.MangaRepo],
    })
], MangaModule);
//# sourceMappingURL=manga.module.js.map