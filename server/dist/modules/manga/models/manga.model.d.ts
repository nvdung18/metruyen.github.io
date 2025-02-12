import { Category } from '@modules/category/models/category.model';
import { Model } from 'sequelize-typescript';
export declare class Manga extends Model {
    manga_id: number;
    manga_title: string;
    manga_thumb: string;
    manga_slug: string;
    manga_description: string;
    manga_author: string;
    manga_status: string;
    manga_views: number;
    manga_ratings_count: number;
    manga_total_star_rating: number;
    manga_number_of_followers: number;
    is_deleted: boolean;
    is_draft: boolean;
    is_published: boolean;
    createdAt: Date;
    updatedAt: Date;
    categories: Category[];
}
