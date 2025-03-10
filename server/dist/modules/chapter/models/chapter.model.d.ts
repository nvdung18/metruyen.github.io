import { Model } from 'sequelize-typescript';
import { Manga } from '@modules/manga/models/manga.model';
export declare class Chapter extends Model {
    chap_id: number;
    chap_manga_id: number;
    manga: Manga;
    chap_number: number;
    chap_title: string;
    chap_content: string;
    chap_views: number;
    is_deleted: boolean;
}
