"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModule = void 0;
const common_1 = require("@nestjs/common");
const favorite_service_1 = require("./favorite.service");
const favorite_controller_1 = require("./favorite.controller");
const sequelize_1 = require("@nestjs/sequelize");
const favorite_model_1 = require("./models/favorite.model");
const favorite_repo_1 = require("./favorite.repo");
const favorite_details_model_1 = require("./models/favorite-details.model");
const manga_module_1 = require("../manga/manga.module");
let FavoriteModule = class FavoriteModule {
};
exports.FavoriteModule = FavoriteModule;
exports.FavoriteModule = FavoriteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([favorite_model_1.Favorite, favorite_details_model_1.FavoriteDetail]),
            manga_module_1.MangaModule,
        ],
        controllers: [favorite_controller_1.FavoriteController],
        providers: [favorite_service_1.FavoriteService, favorite_repo_1.FavoriteRepo],
        exports: [sequelize_1.SequelizeModule, favorite_repo_1.FavoriteRepo, favorite_service_1.FavoriteService],
    })
], FavoriteModule);
//# sourceMappingURL=favorite.module.js.map