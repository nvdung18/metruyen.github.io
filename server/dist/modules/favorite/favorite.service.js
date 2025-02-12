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
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const favorite_repo_1 = require("./favorite.repo");
const favorite_details_model_1 = require("./models/favorite-details.model");
const manga_service_1 = require("../manga/manga.service");
let FavoriteService = class FavoriteService {
    constructor(favoriteRepo, mangaService) {
        this.favoriteRepo = favoriteRepo;
        this.mangaService = mangaService;
    }
    async addMangaToFavorite(favoriteDetailsDto, fav_user_id) {
        const foundFavorite = await this.favoriteRepo.findFavoriteById(favoriteDetailsDto.fav_id, fav_user_id);
        if (!foundFavorite)
            throw new common_1.HttpException('Not found favorite', common_1.HttpStatus.BAD_REQUEST);
        await this.mangaService.findMangaById(favoriteDetailsDto.manga_id);
        const favoriteDetails = await this.favoriteRepo.addMangaToFavorite(new favorite_details_model_1.FavoriteDetail({
            ...favoriteDetailsDto,
        }));
        if (!favoriteDetails)
            throw new common_1.HttpException('Failed to add manga to favorite', common_1.HttpStatus.BAD_REQUEST);
        return favoriteDetails.get({ plain: true });
    }
    async deleteMangaFromFavorite(favoriteDetailsDto, fav_user_id) {
        const foundFavorite = await this.favoriteRepo.findFavoriteById(favoriteDetailsDto.fav_id, fav_user_id);
        if (!foundFavorite)
            throw new common_1.HttpException('Not found favorite', common_1.HttpStatus.BAD_REQUEST);
        const isDeleted = await this.favoriteRepo.deleteMangaFromFavorite({
            fav_id: favoriteDetailsDto.fav_id,
            manga_id: favoriteDetailsDto.manga_id,
        });
        if (!isDeleted)
            throw new common_1.HttpException('Failed to delete manga from favorite', common_1.HttpStatus.BAD_REQUEST);
        return isDeleted;
    }
    async getListMangaFromFavorite(fav_id, fav_user_id) {
        const foundFavorite = await this.favoriteRepo.findFavoriteById(fav_id, fav_user_id);
        if (!foundFavorite)
            throw new common_1.HttpException('Not found favorite', common_1.HttpStatus.BAD_REQUEST);
        const listMangaFromFavorite = await this.favoriteRepo.getListMangaFromFavorite(fav_id, { raw: true });
        return listMangaFromFavorite;
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [favorite_repo_1.FavoriteRepo,
        manga_service_1.MangaService])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map