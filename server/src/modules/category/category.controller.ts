import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { GuestRole, Roles } from '@common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Admin create new Category',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
    `,
  })
  @Post('')
  @ResponseMessage('Category created successfully')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'updateAny', resource: 'Categories' })
  async createNewCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return {
      metadata: await this.categoryService.createNewCategory(createCategoryDto),
    };
  }

  @ApiOperation({
    summary: 'Admin update Category',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
    `,
  })
  @ApiQuery({ name: 'id', type: Number, description: 'Id of category' })
  @Put('')
  @HttpCode(200)
  @ResponseMessage('Category updated successfully')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'updateAny', resource: 'Categories' })
  async updateCategory(
    @Query('id') categoryId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return {
      metadata: await this.categoryService.updateCategory(
        categoryId,
        createCategoryDto,
      ),
    };
  }

  @ApiOperation({
    summary: 'Get all category',
    description: `
  - **${SwaggerApiOperation.CLIENT_ID_OPTIONAL}**
  - Everyone can use this route
  - **Admin** can see more information of category
    `,
  })
  @Get('')
  @ResponseMessage('Get categories successfully')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'readAny', resource: 'Categories' })
  @GuestRole(true) // this one not need role, but if u are an admin, you can see more details information of category
  async getAllCategories(@Req() req: Request) {
    const data = await this.categoryService.getAllCategories();
    return {
      metadata: req['permission'].filter(data),
    };
  }
}
