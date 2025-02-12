import { CreateMangaDto } from './create-manga.dto';
export declare enum MangaStatus {
    ONGOING = "ongoing",
    COMPLETED = "completed",
    HIATUS = "hiatus"
}
declare const UpdateMangaDto_base: import("@nestjs/common").Type<Partial<Omit<CreateMangaDto, "category_id">>>;
export declare class UpdateMangaDto extends UpdateMangaDto_base {
    manga_status: MangaStatus;
}
export {};
