import { Manga } from '@modules/manga/models/manga.model';
import { Model } from 'sequelize-typescript';
export declare class Category extends Model<Category> {
    category_id: number;
    category_name: string;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    manga: Manga[];
}
