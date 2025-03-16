/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MangaRepo } from './manga.repo';
import { CreateMangaDto } from './dto/create-manga.dto';
import Util from '@common/services/util.service';
import { Manga } from './models/manga.model';
import { Sequelize } from 'sequelize-typescript';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { MangaCategory } from './models/manga-category.model';
import { MangaDto } from './dto/manga.dto';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import PaginateUtil from 'src/shared/utils/paginate.util';
import { SearchMangaDto } from './dto/search-manga.dto';
import { literal } from 'sequelize';
import { Category } from '@modules/category/models/category.model';
import CommonUtil from 'src/shared/utils/common.util';
import { HistoryType } from 'src/shared/utils/enums.util';
import { Web3Service } from 'src/shared/web3/web3.service';
import { PinataService } from 'src/shared/pinata/pinata.service';
import { ContractTransaction } from 'ethers';

@Injectable()
export class MangaService {
  constructor(
    private mangaRepo: MangaRepo,
    private util: Util,
    private sequelize: Sequelize,
    private web3Service: Web3Service,
    private pinataService: PinataService,
  ) {}

  async testWeb3() {
    return await this.web3Service.getOwner();
  }

  async createManga(createMangaDto: CreateMangaDto) {
    const mangaId = this.util.generateIdByTime();
    const mangaSlug = this.util.generateSlug([
      createMangaDto.manga_title,
      Math.floor(mangaId / 1000).toString(),
    ]);

    const { category_id, ...rest } = createMangaDto;

    const result = await this.sequelize.transaction(async (t) => {
      const manga = await this.mangaRepo.createNewManga(
        new Manga({
          ...rest,
          manga_id: mangaId,
          manga_slug: mangaSlug,
        }),
        { transaction: t },
      );

      await this.addMangaCategory(
        category_id,
        mangaId,
        {
          transaction: t,
        },
        true, //isCreateManga
      );

      const folderName = `${rest.manga_title}-history`;
      const jsonBufferHistory = CommonUtil.createMangaJsonBufferHistory(
        HistoryType.CreateManga,
        0,
        {
          changes: [{ ...rest, manga_id: mangaId, manga_slug: mangaSlug }],
        },
      );
      const uploadJson = await this.pinataService.uploadFile(
        jsonBufferHistory,
        `${rest.manga_title}-history-v0`,
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

      return manga;
    });

    return { result };
  }

  async updateManga(
    mangaId: number,
    updateMangaDto: UpdateMangaDto,
  ): Promise<number> {
    const foundManga = await this.findMangaById(mangaId);
    const folderName = `${foundManga.manga_title}-history`;
    const changes: { field: string; oldValue: any; newValue: any }[] = [];

    Object.entries(updateMangaDto).forEach(([key, value]) => {
      if (value !== undefined && foundManga[key] !== value) {
        changes.push({
          field: key,
          oldValue: foundManga[key],
          newValue: value,
        });
        foundManga[key] = value; // Only replace keys with new values
      }
    });
    // check if there is no change, not need to update
    if (changes.length == 0)
      throw new HttpException('No changes to update', HttpStatus.BAD_REQUEST);

    // update manga
    const result = await this.sequelize.transaction(async (t) => {
      const isUpdatedManga = await this.mangaRepo.updateManga(foundManga, {
        transaction: t,
      });
      if (!isUpdatedManga)
        throw new HttpException('Can not update Manga', HttpStatus.BAD_REQUEST);

      await this.createHistoryOfUpdateManga(
        HistoryType.UpdateManga,
        mangaId,
        folderName,
        { changes: changes },
      );

      return isUpdatedManga;
    });
    return result;
  }

  async addMangaCategory(
    category_id: number[],
    mangaId: number,
    options: object = {},
    isCreateManga: boolean = false,
  ): Promise<MangaCategory[]> {
    if (!isCreateManga) {
      await this.findMangaById(mangaId);
    }

    const mangaCategory = category_id.map((item) => {
      return { category_id: item, manga_id: mangaId };
    });
    const mangaCategories = await this.mangaRepo.addMangaCategory(
      mangaCategory,
      options,
    );
    if (!mangaCategories)
      throw new HttpException(
        'Can not add manga category',
        HttpStatus.BAD_REQUEST,
      );
    return mangaCategories;
  }

  async deleteMangaCategory(
    category_id: number[],
    mangaId: number,
  ): Promise<number> {
    await this.findMangaById(mangaId);

    const mangaCategory = category_id.map((item) => {
      return { category_id: item, manga_id: mangaId };
    });

    const result = await this.sequelize.transaction(async (t) => {
      const isDeleted = await this.mangaRepo.deleteMangaCategory(
        mangaCategory,
        { transaction: t },
      );

      return isDeleted;
    });

    if (!result)
      throw new HttpException(
        'Can not delete manga category',
        HttpStatus.BAD_REQUEST,
      );
    return result;
  }

  async publishMangaById(mangaId: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId, false, true);
    const folderName = `${foundManga.manga_title}-history`;

    const result = this.sequelize.transaction(async (t) => {
      const isPublishedManga = await this.mangaRepo.publishMangaById(mangaId, {
        transaction: t,
      });
      if (!isPublishedManga)
        throw new HttpException(
          'Can not publish manga',
          HttpStatus.BAD_REQUEST,
        );

      await this.createHistoryOfUpdateManga(
        HistoryType.PublishManga,
        mangaId,
        folderName,
        { changes: [] },
      );

      return isPublishedManga;
    });

    return result;
  }

  async unpublishMangaById(mangaId: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId, false, false);
    const folderName = `${foundManga.manga_title}-history`;

    const result = this.sequelize.transaction(async (t) => {
      const isPublishedManga = await this.mangaRepo.unpublishMangaById(
        mangaId,
        {
          transaction: t,
        },
      );
      if (!isPublishedManga)
        throw new HttpException(
          'Can not unpublish manga',
          HttpStatus.BAD_REQUEST,
        );

      await this.createHistoryOfUpdateManga(
        HistoryType.UnpublishManga,
        mangaId,
        folderName,
        { changes: [] },
      );

      return isPublishedManga;
    });

    return result;
  }

  async findMangaById(
    id: number,
    is_deleted: boolean = false,
    is_draft: boolean = false,
  ): Promise<Manga> {
    const whereConditions: any = { manga_id: id, is_deleted, is_draft };
    const foundManga = await this.mangaRepo.findMangaById(whereConditions);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);
    return foundManga;
  }

  async findMangaByIdCanPublishOrUnPublish(
    id: number,
    is_deleted: boolean = false,
  ): Promise<Manga> {
    const whereConditions: any = { manga_id: id, is_deleted };
    const foundManga = await this.mangaRepo.findMangaById(whereConditions);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);
    return foundManga;
  }

  async searchManga(
    paginateDto: PaginatedDto<MangaDto>,
    searchMangaDto: SearchMangaDto,
  ): Promise<PaginatedDto<MangaDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const {
      keyword,
      manga_status,
      category_id,
      updatedAt,
      createdAt,
      manga_views,
      manga_number_of_followers,
    } = searchMangaDto;
    // Where condition array
    const whereConditions: any[] = [
      { is_deleted: false, is_draft: false, is_published: true },
    ];

    // Full-text search condition if keyword is provided
    if (keyword) {
      whereConditions.push(
        literal(
          `MATCH (manga_title, manga_description) AGAINST ('${keyword}*' IN BOOLEAN MODE)`,
        ),
      );
    }

    // Status filter if provided
    if (manga_status) {
      whereConditions.push({ manga_status });
    }

    // Sorting logic
    const order = [];
    if (updatedAt) order.push(['updatedAt', 'DESC']);
    if (createdAt) order.push(['createdAt', 'DESC']);
    if (manga_views) order.push(['manga_views', 'DESC']);
    if (manga_number_of_followers) {
      order.push(['manga_number_of_followers', 'DESC']);
    }

    const includeConditions = category_id
      ? [
          {
            model: Category,
            as: 'categories',
            through: { attributes: [] },
            attributes: [],
            required: !!category_id,
            where: category_id ? { category_id } : undefined,
          },
        ]
      : [];

    const { data, pagination } = await this.mangaRepo.searchManga(
      page,
      limit,
      whereConditions,
      order,
      includeConditions,
      { raw: true },
    );
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getAllUnpublishManga(
    paginateDto: PaginatedDto<MangaDto>,
  ): Promise<PaginatedDto<MangaDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const { data, pagination } =
      await this.mangaRepo.getAllUnPublishMangaPaginate(page, limit, {
        raw: true,
      });
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getAllPublishManga(
    paginateDto: PaginatedDto<MangaDto>,
  ): Promise<PaginatedDto<MangaDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const { data, pagination } =
      await this.mangaRepo.getAllPublishMangaPaginate(page, limit, {
        raw: true,
      });
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getDetailsManga(mangaId: number): Promise<Manga> {
    const foundManga = await this.mangaRepo.getDetailsManga(mangaId, [
      { is_deleted: false, is_draft: false, is_published: true },
    ]);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);
    return foundManga.get({ plain: true });
  }

  async ratingManga(mangaId: number, rating: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId);
    foundManga.manga_ratings_count += 1;
    foundManga.manga_total_star_rating += rating;
    const isUpdatedManga = await this.mangaRepo.updateManga(foundManga);
    if (!isUpdatedManga)
      throw new HttpException('Can not update Manga', HttpStatus.BAD_REQUEST);
    return isUpdatedManga;
  }

  async getNameMangaById(
    mangaId: number,
    conditions: {
      isDeleted?: boolean;
      isDraft?: boolean; //draft is unpublish
      canPublishOrUnpublish?: boolean; //unpublish is draft
    } = { isDeleted: false, isDraft: false, canPublishOrUnpublish: false },
  ): Promise<string> {
    const { canPublishOrUnpublish, isDeleted, isDraft } = conditions;
    let foundManga: Manga;
    if (!canPublishOrUnpublish) {
      foundManga = await this.findMangaById(mangaId, isDeleted, isDraft);
    } else {
      foundManga = await this.findMangaByIdCanPublishOrUnPublish(
        mangaId,
        conditions.isDeleted,
      );
    }
    return foundManga.manga_title;
  }

  async deleteManga(mangaId: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId, false, true);
    const folderName = `${foundManga.manga_title}-history`;

    // delete manga
    const result = await this.sequelize.transaction(async (t) => {
      const isDeleted = await this.mangaRepo.deleteMangaById(mangaId, {
        transaction: t,
      });
      if (!isDeleted)
        throw new HttpException('Can not delete Manga', HttpStatus.BAD_REQUEST);

      await this.createHistoryOfUpdateManga(
        HistoryType.DeleteManga,
        mangaId,
        folderName,
        { changes: [] },
      );

      return isDeleted;
    });
    return result;
  }

  async createHistoryOfUpdateManga(
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
