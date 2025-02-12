import { CategoryRepo } from './category.repo';
import { CreateCategoryDto } from './dto/create-category.dto';
import Util from '@common/services/util.service';
import { Category } from './models/category.model';
export declare class CategoryService {
    private categoryRepo;
    private util;
    constructor(categoryRepo: CategoryRepo, util: Util);
    createNewCategory(createCategoryDto: CreateCategoryDto): Promise<{
        category: Category;
    }>;
    updateCategory(categoryId: number, createCategoryDto: CreateCategoryDto): Promise<number>;
    getAllCategories(): Promise<Array<Category>>;
}
