import { MangaStatus } from './update-manga.dto';
export declare class SearchMangaDto {
    manga_status: MangaStatus;
    category_id: number;
    keyword: string;
    updatedAt: boolean;
    createdAt: boolean;
    manga_views: boolean;
    manga_number_of_followers: boolean;
    validateSortFields: boolean;
}
