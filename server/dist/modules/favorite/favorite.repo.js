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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const favorite_model_1 = require("./models/favorite.model");
const favorite_details_model_1 = require("./models/favorite-details.model");
let FavoriteRepo = class FavoriteRepo {
    constructor(favoriteModel, favoriteDetailsModel) {
        this.favoriteModel = favoriteModel;
        this.favoriteDetailsModel = favoriteDetailsModel;
    }
    async createFavoriteStorage(favorite) {
        return await this.favoriteModel.create(favorite.toJSON());
    }
    async addMangaToFavorite(favoriteDetail) {
        return await this.favoriteDetailsModel.create(favoriteDetail.toJSON());
    }
    async deleteMangaFromFavorite({ fav_id, manga_id, }) {
        return await this.favoriteDetailsModel.destroy({
            where: {
                manga_id: manga_id,
                fav_id: fav_id,
            },
        });
    }
    async findFavoriteById(fav_id, fav_user_id) {
        return await this.favoriteModel.findOne({
            where: { fav_id, fav_user_id },
        });
    }
    async getListMangaFromFavorite(fav_id, options = {}) {
        return await this.favoriteDetailsModel.findAll({
            where: {
                fav_id: fav_id,
            },
            ...options,
        });
    }
};
exports.FavoriteRepo = FavoriteRepo;
exports.FavoriteRepo = FavoriteRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(favorite_model_1.Favorite)),
    __param(1, (0, sequelize_1.InjectModel)(favorite_details_model_1.FavoriteDetail)),
    __metadata("design:paramtypes", [Object, Object])
], FavoriteRepo);
//# sourceMappingURL=favorite.repo.js.map