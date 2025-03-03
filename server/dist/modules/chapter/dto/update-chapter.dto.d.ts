import { CreateChapterDto } from './create-chapter.dto';
declare const UpdateChapterDto_base: import("@nestjs/common").Type<Partial<Omit<CreateChapterDto, "chap_content">>>;
export declare class UpdateChapterDto extends UpdateChapterDto_base {
    chap_img_pages?: number[];
    chap_content: Express.Multer.File[];
}
export {};
