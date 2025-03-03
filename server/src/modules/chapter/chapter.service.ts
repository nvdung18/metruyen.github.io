import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChapterRepo } from './chapter.repo';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { MangaService } from '@modules/manga/manga.service';
import { Chapter } from './models/chapter.model';
import Util from '@common/services/util.service';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepo: ChapterRepo,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mangaService: MangaService,
    private util: Util,
  ) {}

  async createChapterForManga(
    createChapterDto: CreateChapterDto,
    files: Express.Multer.File[],
    mangaId: number,
  ): Promise<any> {
    const nameManga = await this.mangaService.getNameMangaById(mangaId);
    const folderName = `${nameManga}/${createChapterDto.chap_number}`;

    const uploadResults = await this.cloudinaryService.uploadManyFiles(
      files,
      folderName,
    );
    const secureUrls = uploadResults.map((result, index) => ({
      page: index,
      image_url: result.secure_url,
    }));
    const chapterId = this.util.generateIdByTime();
    const newChapter = await this.chapterRepo.createChapter(
      new Chapter({
        chap_id: chapterId,
        chap_manga_id: mangaId,
        chap_title: createChapterDto.chap_title,
        chap_number: createChapterDto.chap_number,
        chap_content: JSON.stringify(secureUrls),
      }),
    );
    if (!newChapter)
      throw new HttpException('Chapter can not create', HttpStatus.BAD_REQUEST);
    return newChapter.get({ plain: true });
  }

  async updateChapterForManga(
    updateChapterDto: UpdateChapterDto,
    chapId: number,
    files: Express.Multer.File[] = [],
  ) {
    // Check chapter is exists
    let foundChapter = await this.findChapterById(chapId);

    // Replace data of dto to old value
    foundChapter = this.util.replaceDataObjectByKey(
      updateChapterDto,
      foundChapter,
    );

    if (files.length != 0 && updateChapterDto.chap_img_pages.length != 0) {
      if (typeof foundChapter.chap_content === 'string') {
        foundChapter.chap_content = JSON.parse(foundChapter.chap_content);
      }
      const nameManga = await this.mangaService.getNameMangaById(
        foundChapter.chap_manga_id,
      );
      const folderName = `${nameManga}/${foundChapter.chap_number}`;

      const uploadResults = await this.cloudinaryService.uploadManyFiles(
        files,
        folderName,
        updateChapterDto.chap_img_pages,
      );
      const secureUrls = uploadResults.map((result, index) => ({
        page: updateChapterDto.chap_img_pages[index],
        image_url: result.secure_url,
      }));

      updateChapterDto.chap_img_pages.forEach((value, index) => {
        foundChapter.chap_content[value] = secureUrls[index];
      });
      foundChapter.chap_content = JSON.stringify(
        foundChapter.chap_content,
      ) as unknown as object;
    }
    const isUpdated = await this.chapterRepo.updateChapter(foundChapter);
    if (!isUpdated)
      throw new HttpException('Can not update Chapter', HttpStatus.BAD_REQUEST);
    return isUpdated;
  }

  async findChapterById(
    chapId: number,
    {
      isDeleted = false,
      options = {},
    }: { isDeleted?: boolean; options?: object } = {},
  ): Promise<Chapter> {
    const foundChapter = await this.chapterRepo.findChapterById(chapId, {
      isDeleted,
      options,
    });
    if (!foundChapter)
      throw new HttpException('Not Found Chapter', HttpStatus.NOT_FOUND);
    return foundChapter;
  }

  async getAllChaptersByMangaId(mangaId: number): Promise<Chapter[]> {
    await this.mangaService.findMangaById(mangaId);

    return await this.chapterRepo.getAllChaptersByMangaId(mangaId, {
      options: { raw: true },
    });
  }

  async getNumberOfChapters(mangaId: number): Promise<number> {
    return await this.chapterRepo.getNumberOfChapters(mangaId);
  }

  async getDetailsOfChapterByChapNumber(
    mangaId: number,
    chapNumber: number,
  ): Promise<Chapter> {
    await this.mangaService.findMangaById(mangaId);

    const foundChapter = await this.chapterRepo.getDetailsOfChapterByChapNumber(
      mangaId,
      chapNumber,
      {
        options: { raw: true },
      },
    );
    if (!foundChapter)
      throw new HttpException('Not Found Chapter', HttpStatus.NOT_FOUND);
    return foundChapter;
  }

  async increaseViewOfChapter(
    mangaId: number,
    chapNumber: number,
  ): Promise<number> {
    await this.mangaService.findMangaById(mangaId);

    const isUpdated = await this.chapterRepo.increaseViewOfChapter(
      mangaId,
      chapNumber,
      {
        options: { raw: true },
      },
    );

    if (!isUpdated)
      throw new HttpException(
        'Can not increase view of chapter',
        HttpStatus.BAD_REQUEST,
      );
    return isUpdated;
  }
}
