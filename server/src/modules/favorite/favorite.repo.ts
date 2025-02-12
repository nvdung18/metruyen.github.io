import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from './models/favorite.model';
import { FavoriteDetail } from './models/favorite-details.model';

@Injectable()
export class FavoriteRepo {
  constructor(
    @InjectModel(Favorite) private favoriteModel: typeof Favorite,
    @InjectModel(FavoriteDetail)
    private favoriteDetailsModel: typeof FavoriteDetail,
  ) {}

  async createFavoriteStorage(favorite: Favorite): Promise<Favorite> {
    return await this.favoriteModel.create(favorite.toJSON());
  }

  async addMangaToFavorite(
    favoriteDetail: FavoriteDetail,
  ): Promise<FavoriteDetail> {
    return await this.favoriteDetailsModel.create(favoriteDetail.toJSON());
  }

  async deleteMangaFromFavorite({
    fav_id,
    manga_id,
  }: {
    fav_id: number;
    manga_id: number;
  }): Promise<number> {
    return await this.favoriteDetailsModel.destroy({
      where: {
        manga_id: manga_id,
        fav_id: fav_id,
      },
    });
  }

  async findFavoriteById(
    fav_id: number,
    fav_user_id: boolean,
  ): Promise<Favorite> {
    return await this.favoriteModel.findOne({
      where: { fav_id, fav_user_id },
    });
  }

  async getListMangaFromFavorite(
    fav_id: number,
    options: object = {},
  ): Promise<FavoriteDetail[]> {
    return await this.favoriteDetailsModel.findAll({
      where: {
        fav_id: fav_id,
      },
      ...options,
    });
  }
}
