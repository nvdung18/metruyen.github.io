import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { UpdateMangaCategoryDto } from './dto/update-manga-category.dto';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { MangaDto } from './dto/manga.dto';
import { SearchMangaDto } from './dto/search-manga.dto';
export declare class MangaController {
    private readonly mangaService;
    constructor(mangaService: MangaService);
    createManga(createMangaDto: CreateMangaDto): Promise<{
        metadata: {
            result: import("./models/manga.model").Manga;
        };
    }>;
    updateManga(id: number, updateMangaDto: UpdateMangaDto): Promise<{
        metadata: number;
    }>;
    addMangaCategory(id: number, updateMangaCategoryDto: UpdateMangaCategoryDto): Promise<{
        metadata: import("./models/manga-category.model").MangaCategory[];
    }>;
    deleteMangaCategory(id: number, updateMangaCategoryDto: UpdateMangaCategoryDto): Promise<{
        metadata: number;
    }>;
    publishManga(id: number): Promise<{
        metadata: number;
    }>;
    unpublishManga(id: number): Promise<{
        metadata: number;
    }>;
    searchManga(req: Request, paginateDto: PaginatedDto<MangaDto>, searchMangaDto: SearchMangaDto): Promise<{
        metadata: any;
        option: {
            pagination: {
                page: number;
                total: number;
                limit: number;
                offset: number;
                totalPages: number;
            };
        };
    }>;
    getAllUnpublishManga(req: Request, paginateDto: PaginatedDto<MangaDto>): Promise<{
        metadata: any;
        option: {
            pagination: {
                page: number;
                total: number;
                limit: number;
                offset: number;
                totalPages: number;
            };
        };
    }>;
    getAllPublishManga(req: Request, paginateDto: PaginatedDto<MangaDto>): Promise<{
        metadata: any;
        option: {
            pagination: {
                page: number;
                total: number;
                limit: number;
                offset: number;
                totalPages: number;
            };
        };
    }>;
    getDetailsManga(req: Request, id: number): Promise<{
        metadata: any;
    }>;
    ratingForManga(req: Request, id: number, rating: number): Promise<{
        metadata: number;
    }>;
}
