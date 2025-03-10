"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaService = void 0;
const common_1 = require("@nestjs/common");
const manga_repo_1 = require("./manga.repo");
const util_service_1 = __importDefault(require("../../common/services/util.service"));
const manga_model_1 = require("./models/manga.model");
const sequelize_typescript_1 = require("sequelize-typescript");
const paginate_util_1 = __importDefault(require("../../shared/utils/paginate.util"));
const sequelize_1 = require("sequelize");
const category_model_1 = require("../category/models/category.model");
let MangaService = class MangaService {
    constructor(mangaRepo, util, sequelize) {
        this.mangaRepo = mangaRepo;
        this.util = util;
        this.sequelize = sequelize;
    }
    async createManga(createMangaDto) {
        const mangaId = this.util.generateIdByTime();
        const mangaSlug = this.util.generateSlug([
            createMangaDto.manga_title,
            Math.floor(mangaId / 1000).toString(),
        ]);
        const { category_id, ...rest } = createMangaDto;
        const result = await this.sequelize.transaction(async (t) => {
            const manga = await this.mangaRepo.createNewManga(new manga_model_1.Manga({
                ...rest,
                manga_id: mangaId,
                manga_slug: mangaSlug,
            }), { transaction: t });
            await this.addMangaCategory(category_id, mangaId, {
                transaction: t,
            }, true);
            return manga;
        });
        if (!result)
            throw new common_1.HttpException('Manga not created', common_1.HttpStatus.BAD_REQUEST);
        return { result };
    }
    async updateManga(mangaId, updateMangaDto) {
        const foundManga = await this.findMangaById(mangaId);
        Object.entries(updateMangaDto).forEach(([key, value]) => {
            if (value !== undefined) {
                foundManga[key] = value;
            }
        });
        const isUpdatedManga = this.mangaRepo.updateManga(foundManga);
        if (!isUpdatedManga)
            throw new common_1.HttpException('Can not update Manga', common_1.HttpStatus.BAD_REQUEST);
        return isUpdatedManga;
    }
    async addMangaCategory(category_id, mangaId, options = {}, isCreateManga = false) {
        if (!isCreateManga) {
            await this.findMangaById(mangaId);
        }
        const mangaCategory = category_id.map((item) => {
            return { category_id: item, manga_id: mangaId };
        });
        const mangaCategories = await this.mangaRepo.addMangaCategory(mangaCategory, options);
        if (!mangaCategories)
            throw new common_1.HttpException('Can not add manga category', common_1.HttpStatus.BAD_REQUEST);
        return mangaCategories;
    }
    async deleteMangaCategory(category_id, mangaId) {
        await this.findMangaById(mangaId);
        const mangaCategory = category_id.map((item) => {
            return { category_id: item, manga_id: mangaId };
        });
        const result = await this.sequelize.transaction(async (t) => {
            const isDeleted = await this.mangaRepo.deleteMangaCategory(mangaCategory, { transaction: t });
            return isDeleted;
        });
        if (!result)
            throw new common_1.HttpException('Can not delete manga category', common_1.HttpStatus.BAD_REQUEST);
        return result;
    }
    async publishMangaById(mangaId) {
        await this.findMangaById(mangaId);
        const isPublishedManga = await this.mangaRepo.publishMangaById(mangaId);
        if (!isPublishedManga)
            throw new common_1.HttpException('Can not publish manga', common_1.HttpStatus.BAD_REQUEST);
        return isPublishedManga;
    }
    async unpublishMangaById(mangaId) {
        await this.findMangaById(mangaId);
        const isUnpublishedManga = await this.mangaRepo.unpublishMangaById(mangaId);
        if (!isUnpublishedManga)
            throw new common_1.HttpException('Can not unpublish manga', common_1.HttpStatus.BAD_REQUEST);
        return isUnpublishedManga;
    }
    async findMangaById(id, is_deleted = false, is_draft = false) {
        const foundManga = await this.mangaRepo.findMangaById(id, is_deleted, is_draft);
        if (!foundManga)
            throw new common_1.HttpException('Not found manga', common_1.HttpStatus.BAD_REQUEST);
        return foundManga;
    }
    async searchManga(paginateDto, searchMangaDto) {
        const page = paginateDto.page;
        const limit = paginateDto.limit;
        const { keyword, manga_status, category_id, updatedAt, createdAt, manga_views, manga_number_of_followers, } = searchMangaDto;
        const whereConditions = [
            { is_deleted: false, is_draft: false, is_published: true },
        ];
        if (keyword) {
            whereConditions.push((0, sequelize_1.literal)(`MATCH (manga_title, manga_description) AGAINST ('${keyword}*' IN BOOLEAN MODE)`));
        }
        if (manga_status) {
            whereConditions.push({ manga_status });
        }
        const order = [];
        if (updatedAt)
            order.push(['updatedAt', 'DESC']);
        if (createdAt)
            order.push(['createdAt', 'DESC']);
        if (manga_views)
            order.push(['manga_views', 'DESC']);
        if (manga_number_of_followers) {
            order.push(['manga_number_of_followers', 'DESC']);
        }
        const includeConditions = category_id
            ? [
                {
                    model: category_model_1.Category,
                    as: 'categories',
                    through: { attributes: [] },
                    attributes: [],
                    required: !!category_id,
                    where: category_id ? { category_id } : undefined,
                },
            ]
            : [];
        const { data, pagination } = await this.mangaRepo.searchManga(page, limit, whereConditions, order, includeConditions, { raw: true });
        paginateDto = paginate_util_1.default.setPaginateDto(paginateDto, data, pagination);
        return paginateDto;
    }
    async getAllUnpublishManga(paginateDto) {
        const page = paginateDto.page;
        const limit = paginateDto.limit;
        const { data, pagination } = await this.mangaRepo.getAllUnPublishMangaPaginate(page, limit, {
            raw: true,
        });
        paginateDto = paginate_util_1.default.setPaginateDto(paginateDto, data, pagination);
        return paginateDto;
    }
    async getAllPublishManga(paginateDto) {
        const page = paginateDto.page;
        const limit = paginateDto.limit;
        const { data, pagination } = await this.mangaRepo.getAllPublishMangaPaginate(page, limit, {
            raw: true,
        });
        paginateDto = paginate_util_1.default.setPaginateDto(paginateDto, data, pagination);
        return paginateDto;
    }
    async getDetailsManga(mangaId) {
        const foundManga = await this.mangaRepo.getDetailsManga(mangaId, [
            { is_deleted: false, is_draft: false, is_published: true },
        ]);
        if (!foundManga)
            throw new common_1.HttpException('Not found manga', common_1.HttpStatus.BAD_REQUEST);
        return foundManga.get({ plain: true });
    }
    async ratingManga(mangaId, rating) {
        const foundManga = await this.findMangaById(mangaId);
        foundManga.manga_ratings_count += 1;
        foundManga.manga_total_star_rating += rating;
        const isUpdatedManga = await this.mangaRepo.updateManga(foundManga);
        if (!isUpdatedManga)
            throw new common_1.HttpException('Can not update Manga', common_1.HttpStatus.BAD_REQUEST);
        return isUpdatedManga;
    }
    async getNameMangaById(mangaId) {
        const foundManga = await this.findMangaById(mangaId);
        return foundManga.manga_title;
    }
    async deleteManga(mangaId) {
        await this.findMangaById(mangaId);
        const isDeletedManga = await this.mangaRepo.deleteMangaById(mangaId);
        if (!isDeletedManga)
            throw new common_1.HttpException('Can not delete Manga', common_1.HttpStatus.BAD_REQUEST);
        return isDeletedManga;
    }
};
exports.MangaService = MangaService;
exports.MangaService = MangaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [manga_repo_1.MangaRepo,
        util_service_1.default,
        sequelize_typescript_1.Sequelize])
], MangaService);
//# sourceMappingURL=manga.service.js.map