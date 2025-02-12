import { Category } from './models/category.model';
export declare class CategoryRepo {
    private categoryModel;
    constructor(categoryModel: typeof Category);
    findCategoryByName(name: string): Promise<Category>;
    findCategoryById(id: number): Promise<Category>;
    createCategory(category: Category): Promise<Category>;
    updateCategory(category: Category): Promise<number>;
    getAllCategories(option?: object): Promise<Array<Category>>;
}
