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
exports.MangaController = void 0;
const common_1 = require("@nestjs/common");
const manga_service_1 = require("./manga.service");
const create_manga_dto_1 = require("./dto/create-manga.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
const update_manga_dto_1 = require("./dto/update-manga.dto");
const at_least_one_field_pipe_1 = require("../../common/pipes/at-least-one-field.pipe");
const util_service_1 = __importDefault(require("../../common/services/util.service"));
const update_manga_category_dto_1 = require("./dto/update-manga-category.dto");
const archived_resource_decorator_1 = require("../../common/decorators/archived-resource.decorator");
const paginate_dto_1 = require("../../shared/dto/paginate.dto");
const api_paginate_query_decorator_1 = require("../../common/decorators/api-paginate-query.decorator");
const search_manga_dto_1 = require("./dto/search-manga.dto");
const authorize_action_decorator_1 = require("../../common/decorators/authorize-action.decorator");
let MangaController = class MangaController {
    constructor(mangaService) {
        this.mangaService = mangaService;
    }
    async createManga(createMangaDto) {
        return {
            metadata: await this.mangaService.createManga(createMangaDto),
        };
    }
    async updateManga(id, updateMangaDto) {
        return {
            metadata: await this.mangaService.updateManga(id, updateMangaDto),
        };
    }
    async addMangaCategory(id, updateMangaCategoryDto) {
        return {
            metadata: await this.mangaService.addMangaCategory(updateMangaCategoryDto.category_id, id),
        };
    }
    async deleteMangaCategory(id, updateMangaCategoryDto) {
        return {
            metadata: await this.mangaService.deleteMangaCategory(updateMangaCategoryDto.category_id, id),
        };
    }
    async publishManga(id) {
        return {
            metadata: await this.mangaService.publishMangaById(id),
        };
    }
    async unpublishManga(id) {
        return {
            metadata: await this.mangaService.unpublishMangaById(id),
        };
    }
    async searchManga(req, paginateDto, searchMangaDto) {
        const data = await this.mangaService.searchManga(paginateDto, searchMangaDto);
        const { results, ...pagination } = data;
        return {
            metadata: req['permission'].filter(results),
            option: { pagination },
        };
    }
    async getAllUnpublishManga(req, paginateDto) {
        const data = await this.mangaService.getAllUnpublishManga(paginateDto);
        const { results, ...pagination } = data;
        return {
            metadata: req['permission'].filter(results),
            option: {
                pagination,
            },
        };
    }
    async getAllPublishManga(req, paginateDto) {
        const data = await this.mangaService.getAllPublishManga(paginateDto);
        const { results, ...pagination } = data;
        return {
            metadata: req['permission'].filter(results),
            option: {
                pagination,
            },
        };
    }
    async getDetailsManga(req, id) {
        const data = await this.mangaService.getDetailsManga(id);
        return {
            metadata: req['permission'].filter(data),
        };
    }
    async ratingForManga(req, id, rating) {
        const data = await this.mangaService.ratingManga(id, rating);
        return {
            metadata: data,
        };
    }
};
exports.MangaController = MangaController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin create Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
      `,
    }),
    (0, common_1.Post)(''),
    (0, response_message_decorator_1.ResponseMessage)('Manga created successfully'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'createAny', resource: 'Manga' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manga_dto_1.CreateMangaDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "createManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin update Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.

  - \`manga_status\` has the following values: ${util_service_1.default.getAllDataOfEnum(update_manga_dto_1.MangaStatus).join('\n')}

  - **All attributes in request body is an option**
      `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Id of manga',
    }),
    (0, common_1.Patch)(':id'),
    (0, response_message_decorator_1.ResponseMessage)('Manga updated successfully'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'updateAny', resource: 'Manga' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new at_least_one_field_pipe_1.AtLeastOneFieldPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_manga_dto_1.UpdateMangaDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "updateManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin add Manga Category',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
  - Can add many categories.
      `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Id of manga',
    }),
    (0, common_1.Post)('/manga-category/:id'),
    (0, response_message_decorator_1.ResponseMessage)('Add Manga Category successful'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'updateAny', resource: 'Manga' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_manga_category_dto_1.UpdateMangaCategoryDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "addMangaCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin delete Manga Category',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
  - Can delete many categories.
  - If have any error in process delete, it will rollback data
      `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Id of manga',
    }),
    (0, common_1.Delete)('/manga-category/:id'),
    (0, response_message_decorator_1.ResponseMessage)('Delete Manga Category successful'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'deleteAny', resource: 'Manga' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_manga_category_dto_1.UpdateMangaCategoryDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "deleteMangaCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin publish Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
      `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Id of manga',
    }),
    (0, common_1.Patch)('/publish/:id'),
    (0, response_message_decorator_1.ResponseMessage)('Publish Manga successful'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'updateAny', resource: 'Manga' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "publishManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin unpublish Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
      `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Id of manga',
    }),
    (0, common_1.Patch)('/unpublish/:id'),
    (0, response_message_decorator_1.ResponseMessage)('Unpublish Manga successful'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'updateAny', resource: 'Manga' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "unpublishManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Search Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Everyone can use this route
  - **Just only choose one sort field**:
      'updatedAt',
      'createdAt',
      'manga_views',
      'manga_number_of_followers',
  - **Admin** can see more information
      `,
    }),
    (0, common_1.Get)('/search'),
    (0, response_message_decorator_1.ResponseMessage)('Search manga successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'readAny', resource: 'Manga' }),
    (0, api_paginate_query_decorator_1.ApiPaginateQuery)(),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        paginate_dto_1.PaginatedDto,
        search_manga_dto_1.SearchMangaDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "searchManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all unpublish manga',
        description: `
  - **${constants_1.SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Only **admin** can see this API
      `,
    }),
    (0, common_1.Get)('/unpublish'),
    (0, response_message_decorator_1.ResponseMessage)('Get all unpublish manga successful'),
    (0, roles_decorator_1.Roles)({ action: 'readAny', resource: 'Manga' }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, archived_resource_decorator_1.ArchivedResourceAccess)(true),
    (0, api_paginate_query_decorator_1.ApiPaginateQuery)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        paginate_dto_1.PaginatedDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "getAllUnpublishManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all publish manga',
        description: `
  - **${constants_1.SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Everyone can use this route
  - Order by updated date
  - **Admin** can see more information
      `,
    }),
    (0, common_1.Get)('/publish'),
    (0, response_message_decorator_1.ResponseMessage)('Get all publish manga successful'),
    (0, roles_decorator_1.Roles)({ action: 'readAny', resource: 'Manga' }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.GuestRole)(true),
    (0, api_paginate_query_decorator_1.ApiPaginateQuery)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        paginate_dto_1.PaginatedDto]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "getAllPublishManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'View Details Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Everyone can use this route
  - **Admin** can see more information
  - This route just use to find manga **not deleted, not draft, and published**
      `,
    }),
    (0, common_1.Get)('/details/manga/:id'),
    (0, response_message_decorator_1.ResponseMessage)('Get details manga successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'readAny', resource: 'Manga' }),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Number]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "getDetailsManga", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User rating for Manga',
        description: `
  - **${constants_1.SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Just user have account can use this API
      `,
    }),
    (0, common_1.Patch)('/rating/:id'),
    (0, response_message_decorator_1.ResponseMessage)('Rating manga successful'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'readAny', resource: 'Manga' }),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('rating', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Number, Number]),
    __metadata("design:returntype", Promise)
], MangaController.prototype, "ratingForManga", null);
exports.MangaController = MangaController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Manga'),
    (0, common_1.Controller)('manga'),
    __metadata("design:paramtypes", [manga_service_1.MangaService])
], MangaController);
//# sourceMappingURL=manga.controller.js.map