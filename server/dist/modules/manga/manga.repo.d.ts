import { Manga } from './models/manga.model';
import { MangaCategory } from './models/manga-category.model';
import { Attributes } from 'sequelize';
export declare class MangaRepo {
    private mangaModel;
    private mangaCategoryModel;
    constructor(mangaModel: typeof Manga, mangaCategoryModel: typeof MangaCategory);
    createNewManga(manga: Manga, options?: object): Promise<Manga>;
    findMangaById(mangaId: number, is_deleted?: boolean, is_draft?: boolean): Promise<Manga>;
    addMangaCategory(mangaCategory: Attributes<MangaCategory>[], options?: object): Promise<MangaCategory[]>;
    updateManga(manga: Manga, options?: object): Promise<number>;
    deleteMangaCategory(mangaCategory: Attributes<MangaCategory>[], options?: object): Promise<number>;
    publishMangaById(mangaId: number): Promise<number>;
    unpublishMangaById(mangaId: number): Promise<number>;
    deleteMangaById(mangaId: number): Promise<number>;
    searchManga(page: number, limit: number, whereConditions: any[], order: any[], includeConditions: any[], option?: object): Promise<any>;
    getAllUnpublishManga(option?: object): Promise<Array<Manga>>;
    getAllPublishManga(option?: object): Promise<Array<Manga>>;
    getAllPublishMangaPaginate(page: number, limit: number, option?: object): Promise<any>;
    getAllUnPublishMangaPaginate(page: number, limit: number, option?: object): Promise<any>;
    getDetailsManga(mangaId: number, whereConditions?: any[], options?: object): Promise<Manga>;
}
