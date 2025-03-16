import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChapterRepo } from './chapter.repo';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { MangaService } from '@modules/manga/manga.service';
import { Chapter } from './models/chapter.model';
import Util from '@common/services/util.service';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PinataService } from 'src/shared/pinata/pinata.service';
import { HistoryType } from 'src/shared/utils/enums.util';
import { ContractTransaction } from 'ethers';
import { Web3Service } from 'src/shared/web3/web3.service';
import CommonUtil from 'src/shared/utils/common.util';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepo: ChapterRepo,
    private readonly mangaService: MangaService,
    private readonly pinataService: PinataService,
    private util: Util,
    private web3Service: Web3Service,
    private sequelize: Sequelize,
  ) {}

  async createChapterForManga(
    createChapterDto: CreateChapterDto,
    files: Express.Multer.File[],
    mangaId: number,
  ): Promise<Chapter> {
    const nameManga = await this.mangaService.getNameMangaById(mangaId, {
      canPublishOrUnpublish: true,
    });
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
      `${new Date().toISOString()}-${createChapterDto.chap_number}-content`,
      folderName,
    );

    const result = this.sequelize.transaction(async (t) => {
      const chapterId = this.util.generateIdByTime();
      const updateObj = {
        chap_id: chapterId,
        chap_manga_id: mangaId,
        chap_title: createChapterDto.chap_title,
        chap_number: createChapterDto.chap_number,
        chap_content: uploadJsonUrls['IpfsHash'],
      };
      const newChapter = await this.chapterRepo.createChapter(
        new Chapter(updateObj),
        { transaction: t },
      );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.CreateChapter,
        mangaId,
        folderHistoryName,
        {
          changes: [updateObj],
        },
      );
      return newChapter.get({ plain: true });
    });
    return result;
  }

  async updateChapterForManga(
    updateChapterDto: UpdateChapterDto,
    chapId: number,
    files: Express.Multer.File[] = [],
  ) {
    // Check chapter is exists
    let foundChapter = await this.findChapterById(chapId);
    // Get nameManga
    const nameManga = await this.mangaService.getNameMangaById(
      foundChapter.chap_manga_id,
      {
        canPublishOrUnpublish: true,
      },
    );

    // Replace data of dto to old value
    const { changes, updatedObject } = this.util.replaceDataObjectByKey({
      objReplace: updateChapterDto,
      objWillBeReplace: foundChapter,
    });
    foundChapter = updatedObject;

    if (files.length != 0 && updateChapterDto.chap_img_pages.length != 0) {
      const chapterContent = await this.pinataService.getFileByCid(
        foundChapter.chap_content,
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
        // `${nameManga}-${foundChapter.chap_number}`,
        `${new Date().toISOString()}-${foundChapter.chap_number}-content`,
        folderName,
      );

      changes.push({
        field: 'chap_content',
        oldValue: foundChapter.chap_content,
        newValue: uploadJsonUrls['IpfsHash'],
      });
      foundChapter.chap_content = uploadJsonUrls['IpfsHash'];
    }

    const result = this.sequelize.transaction(async (t) => {
      const isUpdated = await this.chapterRepo.updateChapter(foundChapter);
      if (!isUpdated)
        throw new HttpException(
          'Can not update Chapter',
          HttpStatus.BAD_REQUEST,
        );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.UpdateChapter,
        foundChapter.chap_manga_id,
        folderHistoryName,
        {
          changes: changes,
        },
      );

      return isUpdated;
    });
    return result;
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
    // Check chapter is exists
    const foundChapter = await this.findChapterById(chapId);
    // Check manga is not deleted then get nameManga
    const nameManga = await this.mangaService.getNameMangaById(
      foundChapter.chap_manga_id,
      {
        canPublishOrUnpublish: true,
      },
    );

    const result = this.sequelize.transaction(async (t) => {
      const isDeleted = await this.chapterRepo.deleteChapterById(chapId, {
        transaction: t,
      });
      if (!isDeleted)
        throw new HttpException(
          'Can not delete Chapter',
          HttpStatus.BAD_REQUEST,
        );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.DeleteChapter,
        foundChapter.chap_manga_id,
        folderHistoryName,
        {
          changes: [],
        },
      );

      return isDeleted;
    });
    return result;
  }

  async createHistoryOfUpdateChapter(
    type: HistoryType,
    mangaId: number,
    folderName: string,
    data: { changes: object[] } = {
      changes: [],
    },
  ): Promise<ContractTransaction> {
    const { changes } = data;

    // create and upload history file to Pinata
    const { cid } =
      await this.web3Service.getDataLatestBlockOfMangaUpdateByMangaId(mangaId);
    const dataOfLatestVersion = await this.pinataService.getFileByCid(cid);

    const { jsonBufferHistory, newVersion } =
      CommonUtil.createDataHistoryUpdateManga(type, cid, {
        dataToUpdate: changes,
        dataOfLatestVersion: dataOfLatestVersion,
      });

    const uploadJson = await this.pinataService.uploadFile(
      jsonBufferHistory,
      `${folderName}-v${newVersion}`,
      folderName,
    );

    // call smart contract to create a transaction in blockchain
    const tx = await this.web3Service
      .updateManga(mangaId, uploadJson['IpfsHash'])
      .catch(async (err) => {
        await this.pinataService.deleteFilesByCid([uploadJson['IpfsHash']]);
        throw new HttpException(
          'Something wrong when create manga',
          HttpStatus.BAD_REQUEST,
        );
      });
    return tx;
  }
}
