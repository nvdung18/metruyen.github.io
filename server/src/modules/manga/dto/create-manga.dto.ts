import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ApiSchema({ description: 'Description of the CreateMangaDto schema' })
export class CreateMangaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Invalid format' })
  manga_title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Invalid format' })
  manga_thumb: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Invalid format' })
  manga_author: string;

  @ApiProperty({ type: [Number], maxItems: 1 })
  @IsArray({ message: 'category_id must be an array' })
  @ArrayNotEmpty({ message: 'category_id cannot be empty' })
  @IsNumber({}, { each: true, message: 'Each category_id must be a number' }) // Validate that each element is a number
  @Type(() => Number) // Transform each value in the array to a number
  category_id: number[];

  @ApiPropertyOptional()
  @IsString({ message: 'Invalid format' })
  @IsOptional()
  manga_description: string;
}
