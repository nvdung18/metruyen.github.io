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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const category_repo_1 = require("./category.repo");
const util_service_1 = __importDefault(require("../../common/services/util.service"));
const category_model_1 = require("./models/category.model");
let CategoryService = class CategoryService {
    constructor(categoryRepo, util) {
        this.categoryRepo = categoryRepo;
        this.util = util;
    }
    async createNewCategory(createCategoryDto) {
        const foundCategory = await this.categoryRepo.findCategoryByName(createCategoryDto.category_name);
        if (foundCategory)
            throw new common_1.HttpException('Category already exists', common_1.HttpStatus.BAD_REQUEST);
        const category = await this.categoryRepo.createCategory(new category_model_1.Category({
            category_id: this.util.generateIdByTime({ fitWithInteger: true }),
            category_name: createCategoryDto.category_name,
        }));
        if (!category)
            throw new common_1.HttpException('Category not created', common_1.HttpStatus.BAD_REQUEST);
        return { category };
    }
    async updateCategory(categoryId, createCategoryDto) {
        const foundCategory = await this.categoryRepo.findCategoryById(categoryId);
        if (!foundCategory)
            throw new common_1.HttpException('Category not exists', common_1.HttpStatus.BAD_REQUEST);
        foundCategory.category_name = createCategoryDto.category_name;
        const isUpdated = await this.categoryRepo.updateCategory(foundCategory);
        if (!isUpdated)
            throw new common_1.HttpException('Can not update category', common_1.HttpStatus.BAD_REQUEST);
        return isUpdated;
    }
    async getAllCategories() {
        const categories = await this.categoryRepo.getAllCategories({ raw: true });
        return categories;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repo_1.CategoryRepo,
        util_service_1.default])
], CategoryService);
//# sourceMappingURL=category.service.js.map