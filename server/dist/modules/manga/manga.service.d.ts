import { MangaRepo } from './manga.repo';
import { CreateMangaDto } from './dto/create-manga.dto';
import Util from '@common/services/util.service';
import { Manga } from './models/manga.model';
import { Sequelize } from 'sequelize-typescript';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { MangaCategory } from './models/manga-category.model';
import { MangaDto } from './dto/manga.dto';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { SearchMangaDto } from './dto/search-manga.dto';
export declare class MangaService {
    private mangaRepo;
    private util;
    private sequelize;
    constructor(mangaRepo: MangaRepo, util: Util, sequelize: Sequelize);
    createManga(createMangaDto: CreateMangaDto): Promise<{
        result: Manga;
    }>;
    updateManga(mangaId: number, updateMangaDto: UpdateMangaDto): Promise<number>;
    addMangaCategory(category_id: number[], mangaId: number, options?: object, isCreateManga?: boolean): Promise<MangaCategory[]>;
    deleteMangaCategory(category_id: number[], mangaId: number): Promise<number>;
    publishMangaById(mangaId: number): Promise<number>;
    unpublishMangaById(mangaId: number): Promise<number>;
    findMangaById(id: number, is_deleted?: boolean, is_draft?: boolean): Promise<Manga>;
    searchManga(paginateDto: PaginatedDto<MangaDto>, searchMangaDto: SearchMangaDto): Promise<PaginatedDto<MangaDto>>;
    getAllUnpublishManga(paginateDto: PaginatedDto<MangaDto>): Promise<PaginatedDto<MangaDto>>;
    getAllPublishManga(paginateDto: PaginatedDto<MangaDto>): Promise<PaginatedDto<MangaDto>>;
    getDetailsManga(mangaId: number): Promise<Manga>;
    ratingManga(mangaId: number, rating: number): Promise<number>;
    getNameMangaById(mangaId: number): Promise<string>;
    deleteManga(mangaId: number): Promise<number>;
}
