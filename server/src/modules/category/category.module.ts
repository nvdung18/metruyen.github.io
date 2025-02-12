import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CategoryRepo } from './category.repo';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo],
})
export class CategoryModule {}
