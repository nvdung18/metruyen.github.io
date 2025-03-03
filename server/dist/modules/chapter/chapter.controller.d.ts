import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
    createChapterForManga(req: Request, createChapterDto: CreateChapterDto, files: Express.Multer.File[], mangaId: number): Promise<{
        metadata: any;
    }>;
    updateChapter(req: Request, updateChapterDto: UpdateChapterDto, files: Express.Multer.File[], chapterId: number): Promise<{
        metadata: Number;
    }>;
    getAllChaptersByMangaId(req: Request, mangaId: number): Promise<{
        metadata: any;
    }>;
    getDetailsOfChapterByChapNumber(req: Request, mangaId: number, chapter: number): Promise<{
        metadata: any;
    }>;
    increaseViewOfChapter(req: Request, mangaId: number, chapter: number): Promise<{
        metadata: number;
    }>;
}
