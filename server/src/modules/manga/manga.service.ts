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

@Injectable()
export class MangaService {
  constructor(
    private mangaRepo: MangaRepo,
    private util: Util,
    private sequelize: Sequelize,
  ) {}

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

      return manga;
    });
    if (!result)
      throw new HttpException('Manga not created', HttpStatus.BAD_REQUEST);

    return { result };
  }

  async updateManga(
    mangaId: number,
    updateMangaDto: UpdateMangaDto,
  ): Promise<number> {
    const foundManga = await this.findMangaById(mangaId);

    Object.entries(updateMangaDto).forEach(([key, value]) => {
      if (value !== undefined) {
        foundManga[key] = value; // Only replace keys with new values
      }
    });

    const isUpdatedManga = this.mangaRepo.updateManga(foundManga);
    if (!isUpdatedManga)
      throw new HttpException('Can not update Manga', HttpStatus.BAD_REQUEST);
    return isUpdatedManga;
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
    await this.findMangaById(mangaId);

    const isPublishedManga = await this.mangaRepo.publishMangaById(mangaId);
    if (!isPublishedManga)
      throw new HttpException('Can not publish manga', HttpStatus.BAD_REQUEST);

    return isPublishedManga;
  }

  async unpublishMangaById(mangaId: number): Promise<number> {
    await this.findMangaById(mangaId);

    const isUnpublishedManga = await this.mangaRepo.unpublishMangaById(mangaId);
    if (!isUnpublishedManga)
      throw new HttpException(
        'Can not unpublish manga',
        HttpStatus.BAD_REQUEST,
      );

    return isUnpublishedManga;
  }

  async findMangaById(
    id: number,
    is_deleted: boolean = false,
    is_draft: boolean = false,
  ): Promise<Manga> {
    const foundManga = await this.mangaRepo.findMangaById(
      id,
      is_deleted,
      is_draft,
    );
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
}
