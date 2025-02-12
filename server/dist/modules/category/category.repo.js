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
exports.CategoryRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const category_model_1 = require("./models/category.model");
let CategoryRepo = class CategoryRepo {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async findCategoryByName(name) {
        return this.categoryModel.findOne({ where: { category_name: name } });
    }
    async findCategoryById(id) {
        return this.categoryModel.findOne({ where: { category_id: id } });
    }
    async createCategory(category) {
        return this.categoryModel.create(category.toJSON());
    }
    async updateCategory(category) {
        const [affectedCount] = await this.categoryModel.update(category.toJSON(), {
            where: { category_id: category.category_id },
        });
        return affectedCount;
    }
    async getAllCategories(option = {}) {
        return this.categoryModel.findAll(option);
    }
};
exports.CategoryRepo = CategoryRepo;
exports.CategoryRepo = CategoryRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [Object])
], CategoryRepo);
//# sourceMappingURL=category.repo.js.map