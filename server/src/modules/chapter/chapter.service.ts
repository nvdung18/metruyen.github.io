import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChapterRepo } from './chapter.repo';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { MangaService } from '@modules/manga/manga.service';
import { Chapter } from './models/chapter.model';
import Util from '@common/services/util.service';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PinataService } from 'src/shared/pinata/pinata.service';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepo: ChapterRepo,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mangaService: MangaService,
    private readonly pinataService: PinataService,
    private util: Util,
  ) {}

  async createChapterForManga(
    createChapterDto: CreateChapterDto,
    files: Express.Multer.File[],
    mangaId: number,
  ): Promise<any> {
    const nameManga = await this.mangaService.getNameMangaById(mangaId);
    const folderName = `${nameManga}/${createChapterDto.chap_number}`;

    const uploadResults = await this.pinataService.uploadManyFiles(
      files,
      folderName,
    );
    const secureUrls = uploadResults.map((result, index) => ({
      page: index,
      image: `ipfs.io/ipfs/${result['IpfsHash']}`,
    }));

    const jsonBufferUrls = Buffer.from(JSON.stringify(secureUrls));
    const uploadJsonUrls = await this.pinataService.uploadFile(
      jsonBufferUrls,
      `${nameManga}-${createChapterDto.chap_number}`,
      folderName,
    );

    const chapterId = this.util.generateIdByTime();
    const newChapter = await this.chapterRepo.createChapter(
      new Chapter({
        chap_id: chapterId,
        chap_manga_id: mangaId,
        chap_title: createChapterDto.chap_title,
        chap_number: createChapterDto.chap_number,
        chap_content: uploadJsonUrls['IpfsHash'],
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
    // Check manga is exists
    await this.mangaService.findMangaById(foundChapter.chap_manga_id);

    // Replace data of dto to old value
    foundChapter = this.util.replaceDataObjectByKey(
      updateChapterDto,
      foundChapter,
    );

    if (files.length != 0 && updateChapterDto.chap_img_pages.length != 0) {
      const chapterContent = await this.pinataService.getFileByCid(
        foundChapter.chap_content,
      );

      const nameManga = await this.mangaService.getNameMangaById(
        foundChapter.chap_manga_id,
      );
      const folderName = `${nameManga}/${foundChapter.chap_number}`;

      const uploadResults = await this.pinataService.uploadManyFiles(
        files,
        folderName,
        updateChapterDto.chap_img_pages,
      );
      const secureUrls = uploadResults.map((result, index) => ({
        page: updateChapterDto.chap_img_pages[index],
        image: `ipfs.io/ipfs/${result['IpfsHash']}`,
      }));

      updateChapterDto.chap_img_pages.forEach((value, index) => {
        chapterContent['data'][value] = secureUrls[index];
      });

      const jsonBufferUrls = Buffer.from(
        JSON.stringify(chapterContent['data']),
      );
      const uploadJsonUrls = await this.pinataService.uploadFile(
        jsonBufferUrls,
        `${nameManga}-${foundChapter.chap_number}`,
        folderName,
      );
      foundChapter.chap_content = uploadJsonUrls['IpfsHash'];
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

  async deleteChapter(chapId: number): Promise<number> {
    await this.findChapterById(chapId);

    const isDeleted = await this.chapterRepo.deleteChapterById(chapId);
    if (!isDeleted)
      throw new HttpException('Can not delete Chapter', HttpStatus.BAD_REQUEST);
    return isDeleted;
  }
}
