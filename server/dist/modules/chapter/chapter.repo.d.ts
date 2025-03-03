import { Chapter } from './models/chapter.model';
import { Sequelize } from 'sequelize-typescript';
export declare class ChapterRepo {
    private chapterModel;
    private sequelize;
    constructor(chapterModel: typeof Chapter, sequelize: Sequelize);
    createChapter(chapter: Chapter, options?: object): Promise<Chapter>;
    updateChapter(chapter: Chapter, options?: object): Promise<Number>;
    findChapterById(chapId: number, { isDeleted, options, }?: {
        isDeleted?: boolean;
        options?: object;
    }): Promise<Chapter>;
    getAllChaptersByMangaId(mangaId: number, { isDeleted, options, }?: {
        isDeleted?: boolean;
        options?: object;
    }): Promise<Chapter[]>;
    getNumberOfChapters(mangaId: number): Promise<number>;
    getDetailsOfChapterByChapNumber(mangaId: number, chapNumber: number, { isDeleted, options, }?: {
        isDeleted?: boolean;
        options?: object;
    }): Promise<Chapter>;
    increaseViewOfChapter(mangaId: number, chapNumber: number, { isDeleted, options, }?: {
        isDeleted?: boolean;
        options?: object;
    }): Promise<number>;
}
