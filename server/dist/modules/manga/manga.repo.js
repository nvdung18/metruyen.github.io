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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const manga_model_1 = require("./models/manga.model");
const manga_category_model_1 = require("./models/manga-category.model");
const sequelize_2 = require("sequelize");
const category_model_1 = require("../category/models/category.model");
const paginate_util_1 = __importDefault(require("../../shared/utils/paginate.util"));
let MangaRepo = class MangaRepo {
    constructor(mangaModel, mangaCategoryModel) {
        this.mangaModel = mangaModel;
        this.mangaCategoryModel = mangaCategoryModel;
    }
    async createNewManga(manga, options = {}) {
        return await this.mangaModel.create(manga.toJSON(), options);
    }
    async findMangaById(mangaId, is_deleted = false, is_draft = false) {
        return await this.mangaModel.findOne({
            where: { manga_id: mangaId, is_deleted, is_draft },
        });
    }
    async addMangaCategory(mangaCategory, options = {}) {
        return await this.mangaCategoryModel.bulkCreate(mangaCategory, options);
    }
    async updateManga(manga, options = {}) {
        const [affectedCount] = await this.mangaModel.update(manga.toJSON(), {
            where: { manga_id: manga.manga_id },
            ...options,
        });
        return affectedCount;
    }
    async deleteMangaCategory(mangaCategory, options = {}) {
        return await this.mangaCategoryModel.destroy({
            where: {
                [sequelize_2.Op.or]: mangaCategory,
            },
            ...options,
        });
    }
    async publishMangaById(mangaId) {
        const [affectedCount] = await this.mangaModel.update({ is_published: true, is_draft: false }, { where: { manga_id: mangaId } });
        return affectedCount;
    }
    async unpublishMangaById(mangaId) {
        const [affectedCount] = await this.mangaModel.update({ is_published: false, is_draft: true }, { where: { manga_id: mangaId } });
        return affectedCount;
    }
    async searchManga(page, limit, whereConditions, order, includeConditions, option = {}) {
        const offset = (page - 1) * limit;
        const { rows: data, count: total } = await this.mangaModel.findAndCountAll({
            where: {
                [sequelize_2.Op.and]: whereConditions,
            },
            include: includeConditions,
            order,
            limit,
            offset,
            ...option,
        });
        return {
            data,
            pagination: paginate_util_1.default.paginationReturn({ page, total, limit, offset }),
        };
    }
    async getAllUnpublishManga(option = {}) {
        return await this.mangaModel.findAll({
            where: { is_draft: true, is_published: false, is_deleted: false },
            order: [['updatedAt', 'DESC']],
            ...option,
        });
    }
    async getAllPublishManga(option = {}) {
        return await this.mangaModel.findAll({
            where: { is_draft: false, is_published: true, is_deleted: false },
            order: [['updatedAt', 'DESC']],
            ...option,
        });
    }
    async getAllPublishMangaPaginate(page, limit, option = {}) {
        const offset = (page - 1) * limit;
        const { rows: data, count: total } = await this.mangaModel.findAndCountAll({
            where: { is_published: true, is_draft: false, is_deleted: false },
            ...option,
            limit,
            offset,
            order: [['updatedAt', 'DESC']],
        });
        return {
            data,
            pagination: paginate_util_1.default.paginationReturn({ page, total, limit, offset }),
        };
    }
    async getAllUnPublishMangaPaginate(page, limit, option = {}) {
        const offset = (page - 1) * limit;
        const { rows: data, count: total } = await this.mangaModel.findAndCountAll({
            where: { is_draft: true, is_published: false, is_deleted: false },
            ...option,
            limit,
            offset,
            order: [['updatedAt', 'DESC']],
        });
        return {
            data,
            pagination: paginate_util_1.default.paginationReturn({ page, total, limit, offset }),
        };
    }
    async getDetailsManga(mangaId, whereConditions = [], options = {}) {
        whereConditions.push({ manga_id: mangaId });
        const includeConditions = [
            {
                model: category_model_1.Category,
                as: 'categories',
                through: { attributes: [] },
                attributes: ['category_id', 'category_name'],
            },
        ];
        return await this.mangaModel.findOne({
            where: { [sequelize_2.Op.and]: whereConditions },
            include: includeConditions,
            ...options,
        });
    }
};
exports.MangaRepo = MangaRepo;
exports.MangaRepo = MangaRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(manga_model_1.Manga)),
    __param(1, (0, sequelize_1.InjectModel)(manga_category_model_1.MangaCategory)),
    __metadata("design:paramtypes", [Object, Object])
], MangaRepo);
//# sourceMappingURL=manga.repo.js.map