import { Model } from 'sequelize-typescript';
import { Manga } from './manga.model';
import { Category } from '@modules/category/models/category.model';
export declare class MangaCategory extends Model {
    category_id: number;
    manga_id: number;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    manga: Manga;
    category: Category;
}
