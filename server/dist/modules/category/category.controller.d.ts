import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createNewCategory(createCategoryDto: CreateCategoryDto): Promise<{
        metadata: {
            category: import("./models/category.model").Category;
        };
    }>;
    updateCategory(categoryId: number, createCategoryDto: CreateCategoryDto): Promise<{
        metadata: number;
    }>;
    getAllCategories(req: Request): Promise<{
        metadata: any;
    }>;
}
