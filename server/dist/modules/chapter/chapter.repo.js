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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const chapter_model_1 = require("./models/chapter.model");
const sequelize_typescript_1 = require("sequelize-typescript");
let ChapterRepo = class ChapterRepo {
    constructor(chapterModel, sequelize) {
        this.chapterModel = chapterModel;
        this.sequelize = sequelize;
    }
    async createChapter(chapter, options = {}) {
        return await this.chapterModel.create(chapter.toJSON(), options);
    }
    async updateChapter(chapter, options = {}) {
        const [affectedCount] = await this.chapterModel.update(chapter.toJSON(), {
            where: { chap_id: chapter.chap_id },
            ...options,
        });
        return affectedCount;
    }
    async findChapterById(chapId, { isDeleted = false, options = {}, } = {}) {
        return await this.chapterModel.findOne({
            where: {
                chap_id: chapId,
                is_deleted: isDeleted,
            },
            ...options,
        });
    }
    async getAllChaptersByMangaId(mangaId, { isDeleted = false, options = {}, } = {}) {
        return await this.chapterModel.findAll({
            where: {
                chap_manga_id: mangaId,
                is_deleted: isDeleted,
            },
            order: [['createdAt', 'DESC']],
            ...options,
        });
    }
    async getNumberOfChapters(mangaId) {
        return await this.chapterModel.max('chap_number', {
            where: {
                chap_manga_id: mangaId,
            },
        });
    }
    async getDetailsOfChapterByChapNumber(mangaId, chapNumber, { isDeleted = false, options = {}, } = {}) {
        return await this.chapterModel.findOne({
            where: {
                chap_manga_id: mangaId,
                chap_number: chapNumber,
                is_deleted: isDeleted,
            },
            ...options,
        });
    }
    async increaseViewOfChapter(mangaId, chapNumber, { isDeleted = false, options = {}, } = {}) {
        const [affectedCount] = await this.chapterModel.update({
            chap_views: this.sequelize.literal('chap_views + 1'),
        }, {
            where: {
                chap_manga_id: mangaId,
                chap_number: chapNumber,
                is_deleted: isDeleted,
            },
            ...options,
        });
        return affectedCount;
    }
};
exports.ChapterRepo = ChapterRepo;
exports.ChapterRepo = ChapterRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(chapter_model_1.Chapter)),
    __metadata("design:paramtypes", [Object, sequelize_typescript_1.Sequelize])
], ChapterRepo);
//# sourceMappingURL=chapter.repo.js.map