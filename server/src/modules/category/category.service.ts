import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { CreateCategoryDto } from './dto/create-category.dto';
import Util from '@common/services/util.service';
import { Category } from './models/category.model';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepo,
    private util: Util,
  ) {}

  async createNewCategory(createCategoryDto: CreateCategoryDto) {
    const foundCategory = await this.categoryRepo.findCategoryByName(
      createCategoryDto.category_name,
    );
    if (foundCategory)
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );

    const category = await this.categoryRepo.createCategory(
      new Category({
        category_id: this.util.generateIdByTime({ fitWithInteger: true }),
        category_name: createCategoryDto.category_name,
      }),
    );
    if (!category)
      throw new HttpException('Category not created', HttpStatus.BAD_REQUEST);

    return { category };
  }

  async updateCategory(
    categoryId: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<number> {
    const foundCategory = await this.categoryRepo.findCategoryById(categoryId);
    if (!foundCategory)
      throw new HttpException('Category not exists', HttpStatus.BAD_REQUEST);

    foundCategory.category_name = createCategoryDto.category_name;
    const isUpdated = await this.categoryRepo.updateCategory(foundCategory);
    if (!isUpdated)
      throw new HttpException(
        'Can not update category',
        HttpStatus.BAD_REQUEST,
      );
    return isUpdated;
  }

  async getAllCategories(): Promise<Array<Category>> {
    const categories = await this.categoryRepo.getAllCategories({ raw: true });
    return categories;
  }
}
