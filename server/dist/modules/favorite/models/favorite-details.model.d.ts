import { Model } from 'sequelize-typescript';
import { Favorite } from './favorite.model';
import { Manga } from '@modules/manga/models/manga.model';
export declare class FavoriteDetail extends Model {
    manga_id: number;
    manga: Manga;
    fav_id: number;
    favorite: Favorite;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
