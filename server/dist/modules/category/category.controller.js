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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async createNewCategory(createCategoryDto) {
        return {
            metadata: await this.categoryService.createNewCategory(createCategoryDto),
        };
    }
    async updateCategory(categoryId, createCategoryDto) {
        return {
            metadata: await this.categoryService.updateCategory(categoryId, createCategoryDto),
        };
    }
    async getAllCategories(req) {
        const data = await this.categoryService.getAllCategories();
        return {
            metadata: req['permission'].filter(data),
        };
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin create new Category',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
    `,
    }),
    (0, common_1.Post)(''),
    (0, response_message_decorator_1.ResponseMessage)('Category created successfully'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'updateAny', resource: 'Categories' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createNewCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin update Category',
        description: `
  - **${constants_1.SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
    `,
    }),
    (0, swagger_1.ApiQuery)({ name: 'id', type: Number, description: 'Id of category' }),
    (0, common_1.Put)(''),
    (0, common_1.HttpCode)(200),
    (0, response_message_decorator_1.ResponseMessage)('Category updated successfully'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'updateAny', resource: 'Categories' }),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all category',
        description: `
  - **${constants_1.SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Everyone can use this route
  - **Admin** can see more information of category
    `,
    }),
    (0, common_1.Get)(''),
    (0, response_message_decorator_1.ResponseMessage)('Get categories successfully'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)({ action: 'readAny', resource: 'Categories' }),
    (0, roles_decorator_1.GuestRole)(true),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Category'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map