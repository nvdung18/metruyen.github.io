import { ChapterRepo } from './chapter.repo';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { MangaService } from '@modules/manga/manga.service';
import { Chapter } from './models/chapter.model';
import Util from '@common/services/util.service';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PinataService } from 'src/shared/pinata/pinata.service';
export declare class ChapterService {
    private readonly chapterRepo;
    private readonly cloudinaryService;
    private readonly mangaService;
    private readonly pinataService;
    private util;
    constructor(chapterRepo: ChapterRepo, cloudinaryService: CloudinaryService, mangaService: MangaService, pinataService: PinataService, util: Util);
    createChapterForManga(createChapterDto: CreateChapterDto, files: Express.Multer.File[], mangaId: number): Promise<any>;
    updateChapterForManga(updateChapterDto: UpdateChapterDto, chapId: number, files?: Express.Multer.File[]): Promise<number>;
    findChapterById(chapId: number, { isDeleted, options, }?: {
        isDeleted?: boolean;
        options?: object;
    }): Promise<Chapter>;
    getAllChaptersByMangaId(mangaId: number): Promise<Chapter[]>;
    getNumberOfChapters(mangaId: number): Promise<number>;
    getDetailsOfChapterByChapNumber(mangaId: number, chapNumber: number): Promise<Chapter>;
    increaseViewOfChapter(mangaId: number, chapNumber: number): Promise<number>;
    deleteChapter(chapId: number): Promise<number>;
}
