import { Favorite } from './models/favorite.model';
import { FavoriteDetail } from './models/favorite-details.model';
export declare class FavoriteRepo {
    private favoriteModel;
    private favoriteDetailsModel;
    constructor(favoriteModel: typeof Favorite, favoriteDetailsModel: typeof FavoriteDetail);
    createFavoriteStorage(favorite: Favorite): Promise<Favorite>;
    addMangaToFavorite(favoriteDetail: FavoriteDetail): Promise<FavoriteDetail>;
    deleteMangaFromFavorite({ fav_id, manga_id, }: {
        fav_id: number;
        manga_id: number;
    }): Promise<number>;
    findFavoriteById(fav_id: number, fav_user_id: boolean): Promise<Favorite>;
    getListMangaFromFavorite(fav_id: number, options?: object): Promise<FavoriteDetail[]>;
}
