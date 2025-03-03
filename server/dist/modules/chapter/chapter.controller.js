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
exports.ChapterController = void 0;
const common_1 = require("@nestjs/common");
const chapter_service_1 = require("./chapter.service");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const authorize_action_decorator_1 = require("../../common/decorators/authorize-action.decorator");
const create_chapter_dto_1 = require("./dto/create-chapter.dto");
const platform_express_1 = require("@nestjs/platform-express");
const update_chapter_dto_1 = require("./dto/update-chapter.dto");
const at_least_one_field_pipe_1 = require("../../common/pipes/at-least-one-field.pipe");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let ChapterController = class ChapterController {
    constructor(chapterService) {
        this.chapterService = chapterService;
    }
    async createChapterForManga(req, createChapterDto, files, mangaId) {
        const data = await this.chapterService.createChapterForManga(createChapterDto, files, mangaId);
        return {
            metadata: req['permission'].filter(data),
        };
    }
    async updateChapter(req, updateChapterDto, files, chapterId) {
        const result = await this.chapterService.updateChapterForManga(updateChapterDto, chapterId, files);
        return {
            metadata: result,
        };
    }
    async getAllChaptersByMangaId(req, mangaId) {
        const data = await this.chapterService.getAllChaptersByMangaId(mangaId);
        return {
            metadata: req['permission'].filter(data),
        };
    }
    async getDetailsOfChapterByChapNumber(req, mangaId, chapter) {
        const data = await this.chapterService.getDetailsOfChapterByChapNumber(mangaId, chapter);
        return {
            metadata: req['permission'].filter(data),
        };
    }
    async increaseViewOfChapter(req, mangaId, chapter) {
        const data = await this.chapterService.increaseViewOfChapter(mangaId, chapter);
        return {
            metadata: data,
        };
    }
};
exports.ChapterController = ChapterController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Add chapter by admin',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Admin can create new chapter to manga
    `,
    }),
    (0, common_1.Post)(':id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Manga id',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Add chapter',
        schema: {
            type: 'object',
            properties: {
                chap_title: { type: 'string', example: 'Chapter 1: The Beginning' },
                chap_number: { type: 'integer', example: 1 },
                chap_content: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('chap_content')),
    (0, response_message_decorator_1.ResponseMessage)('Chapter added successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'createAny', resource: 'Chapters' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        create_chapter_dto_1.CreateChapterDto, Array, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "createChapterForManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update chapter by admin',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Admin can update chapter
    `,
    }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Chapter id',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Update chapter',
        type: update_chapter_dto_1.UpdateChapterDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('chap_content')),
    (0, response_message_decorator_1.ResponseMessage)('Chapter updated successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'updateAny', resource: 'Chapters' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new at_least_one_field_pipe_1.AtLeastOneFieldPipe({ removeAllEmptyField: true }))),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        update_chapter_dto_1.UpdateChapterDto, Array, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "updateChapter", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all chapters of manga',
        description: `
  - **${constants_1.SwaggerApiOperation.NOT_NEED_AUTH}**
  - Admin can See more information.
    `,
    }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Manga id',
    }),
    (0, response_message_decorator_1.ResponseMessage)('Get all Chapters of manga successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'readAny', resource: 'Chapters' }),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getAllChaptersByMangaId", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'See details chapters',
        description: `
  - **${constants_1.SwaggerApiOperation.NOT_NEED_AUTH}**
  - Admin can See more information.
    `,
    }),
    (0, common_1.Get)('/details/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Manga id',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'chapter',
        type: Number,
        description: 'Chapter of manga',
    }),
    (0, response_message_decorator_1.ResponseMessage)('Get details chapter of manga successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'readAny', resource: 'Chapters' }),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('chapter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Number, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getDetailsOfChapterByChapNumber", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Increase views of chapter',
        description: `
  - **${constants_1.SwaggerApiOperation.NOT_NEED_AUTH}**
    `,
    }),
    (0, common_1.Patch)('/views/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Manga id',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'chapter',
        type: Number,
        description: 'Chapter of manga',
    }),
    (0, response_message_decorator_1.ResponseMessage)('Increase views of chapter successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'readAny', resource: 'Chapters' }),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('chapter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Number, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "increaseViewOfChapter", null);
exports.ChapterController = ChapterController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chapter'),
    __metadata("design:paramtypes", [chapter_service_1.ChapterService])
], ChapterController);
//# sourceMappingURL=chapter.controller.js.map