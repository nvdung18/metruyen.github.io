import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateMangaDto } from './create-manga.dto';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class UpdateMangaCategoryDto extends PickType(CreateMangaDto, [
  'category_id',
] as const) {
  @ApiProperty({
    description: 'New category or category will replace old category',
  })
  category_id: number[]; // Match the type from CreateMangaDto

  @ApiProperty({
    type: [Number],
    description: 'The category id array will be replaced.',
  })
  @Transform(({ value }) => {
    // Handle both string and array inputs
    if (!value.length) return [];
    else if (typeof value === 'string') {
      return value.split(',').map(Number);
    } else if (Array.isArray(value)) {
      return value.map(Number);
    }
    return value;
  })
  @IsArray({ message: 'category_id must be an array' })
  @IsNumber({}, { each: true, message: 'Each category_id must be a number' }) // Validate that each element is a number
  replace_category_id: number[];
}
