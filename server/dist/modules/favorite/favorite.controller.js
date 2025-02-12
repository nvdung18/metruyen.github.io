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
exports.FavoriteController = void 0;
const common_1 = require("@nestjs/common");
const favorite_service_1 = require("./favorite.service");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const authorize_action_decorator_1 = require("../../common/decorators/authorize-action.decorator");
const favorite_details_dto_1 = require("./dto/favorite-details.dto");
let FavoriteController = class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }
    async addMangaToFavorite(req, favoriteDetailsDto) {
        const data = await this.favoriteService.addMangaToFavorite(favoriteDetailsDto, req['user']['sub']);
        return {
            metadata: req['permission'].filter(data),
        };
    }
    async deleteMangaFromFavorite(req, favoriteDetailsDto) {
        const data = await this.favoriteService.deleteMangaFromFavorite(favoriteDetailsDto, req['user']['sub']);
        return {
            metadata: data,
        };
    }
    async getListMangaFromFavorite(id, req) {
        const data = await this.favoriteService.getListMangaFromFavorite(id, req['user']['sub']);
        return {
            metadata: req['permission'].filter(data),
        };
    }
};
exports.FavoriteController = FavoriteController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Add manga to favorite',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Users can add manga to their favorites (follow manga)
    `,
    }),
    (0, common_1.Post)('manga-to-favorite'),
    (0, response_message_decorator_1.ResponseMessage)('Manga added to favorite successfully'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'createOwn', resource: 'Favorites' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        favorite_details_dto_1.FavoriteDetailsDto]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "addMangaToFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete manga to favorite',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Users can delete manga from their favorites (unfollow manga)
    `,
    }),
    (0, common_1.Delete)('manga-from-favorite'),
    (0, response_message_decorator_1.ResponseMessage)('Delete manga from favorite successfully'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'updateOwn', resource: 'Favorites' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        favorite_details_dto_1.FavoriteDetailsDto]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "deleteMangaFromFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get list manga from favorite',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Users can get list manga from their favorites (list followed manga)
    `,
    }),
    (0, common_1.Get)('/manga-from-favorite/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Favorite id',
    }),
    (0, response_message_decorator_1.ResponseMessage)('Get list manga from favorite successfully'),
    (0, authorize_action_decorator_1.AuthorizeAction)({ action: 'updateOwn', resource: 'Favorites' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getListMangaFromFavorite", null);
exports.FavoriteController = FavoriteController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Favorite'),
    (0, common_1.Controller)('favorite'),
    __metadata("design:paramtypes", [favorite_service_1.FavoriteService])
], FavoriteController);
//# sourceMappingURL=favorite.controller.js.map