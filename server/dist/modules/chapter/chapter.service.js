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
exports.ChapterService = void 0;
const common_1 = require("@nestjs/common");
const chapter_repo_1 = require("./chapter.repo");
const cloudinary_service_1 = require("../../shared/cloudinary/cloudinary.service");
const manga_service_1 = require("../manga/manga.service");
const chapter_model_1 = require("./models/chapter.model");
const util_service_1 = __importDefault(require("../../common/services/util.service"));
const pinata_service_1 = require("../../shared/pinata/pinata.service");
let ChapterService = class ChapterService {
    constructor(chapterRepo, cloudinaryService, mangaService, pinataService, util) {
        this.chapterRepo = chapterRepo;
        this.cloudinaryService = cloudinaryService;
        this.mangaService = mangaService;
        this.pinataService = pinataService;
        this.util = util;
    }
    async createChapterForManga(createChapterDto, files, mangaId) {
        const nameManga = await this.mangaService.getNameMangaById(mangaId);
        const folderName = `${nameManga}/${createChapterDto.chap_number}`;
        const uploadResults = await this.pinataService.uploadManyFiles(files, folderName);
        const secureUrls = uploadResults.map((result, index) => ({
            page: index,
            image_url: result['IpfsHash'],
        }));
        const chapterId = this.util.generateIdByTime();
        const newChapter = await this.chapterRepo.createChapter(new chapter_model_1.Chapter({
            chap_id: chapterId,
            chap_manga_id: mangaId,
            chap_title: createChapterDto.chap_title,
            chap_number: createChapterDto.chap_number,
            chap_content: JSON.stringify(secureUrls),
        }));
        if (!newChapter)
            throw new common_1.HttpException('Chapter can not create', common_1.HttpStatus.BAD_REQUEST);
        return newChapter.get({ plain: true });
    }
    async updateChapterForManga(updateChapterDto, chapId, files = []) {
        let foundChapter = await this.findChapterById(chapId);
        foundChapter = this.util.replaceDataObjectByKey(updateChapterDto, foundChapter);
        if (files.length != 0 && updateChapterDto.chap_img_pages.length != 0) {
            if (typeof foundChapter.chap_content === 'string') {
                foundChapter.chap_content = JSON.parse(foundChapter.chap_content);
            }
            const nameManga = await this.mangaService.getNameMangaById(foundChapter.chap_manga_id);
            const folderName = `${nameManga}/${foundChapter.chap_number}`;
            const uploadResults = await this.cloudinaryService.uploadManyFiles(files, folderName, updateChapterDto.chap_img_pages);
            const secureUrls = uploadResults.map((result, index) => ({
                page: updateChapterDto.chap_img_pages[index],
                image_url: result.secure_url,
            }));
            updateChapterDto.chap_img_pages.forEach((value, index) => {
                foundChapter.chap_content[value] = secureUrls[index];
            });
            foundChapter.chap_content = JSON.stringify(foundChapter.chap_content);
        }
        const isUpdated = await this.chapterRepo.updateChapter(foundChapter);
        if (!isUpdated)
            throw new common_1.HttpException('Can not update Chapter', common_1.HttpStatus.BAD_REQUEST);
        return isUpdated;
    }
    async findChapterById(chapId, { isDeleted = false, options = {}, } = {}) {
        const foundChapter = await this.chapterRepo.findChapterById(chapId, {
            isDeleted,
            options,
        });
        if (!foundChapter)
            throw new common_1.HttpException('Not Found Chapter', common_1.HttpStatus.NOT_FOUND);
        return foundChapter;
    }
    async getAllChaptersByMangaId(mangaId) {
        await this.mangaService.findMangaById(mangaId);
        return await this.chapterRepo.getAllChaptersByMangaId(mangaId, {
            options: { raw: true },
        });
    }
    async getNumberOfChapters(mangaId) {
        return await this.chapterRepo.getNumberOfChapters(mangaId);
    }
    async getDetailsOfChapterByChapNumber(mangaId, chapNumber) {
        await this.mangaService.findMangaById(mangaId);
        const foundChapter = await this.chapterRepo.getDetailsOfChapterByChapNumber(mangaId, chapNumber, {
            options: { raw: true },
        });
        if (!foundChapter)
            throw new common_1.HttpException('Not Found Chapter', common_1.HttpStatus.NOT_FOUND);
        return foundChapter;
    }
    async increaseViewOfChapter(mangaId, chapNumber) {
        await this.mangaService.findMangaById(mangaId);
        const isUpdated = await this.chapterRepo.increaseViewOfChapter(mangaId, chapNumber, {
            options: { raw: true },
        });
        if (!isUpdated)
            throw new common_1.HttpException('Can not increase view of chapter', common_1.HttpStatus.BAD_REQUEST);
        return isUpdated;
    }
};
exports.ChapterService = ChapterService;
exports.ChapterService = ChapterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chapter_repo_1.ChapterRepo,
        cloudinary_service_1.CloudinaryService,
        manga_service_1.MangaService,
        pinata_service_1.PinataService,
        util_service_1.default])
], ChapterService);
//# sourceMappingURL=chapter.service.js.map