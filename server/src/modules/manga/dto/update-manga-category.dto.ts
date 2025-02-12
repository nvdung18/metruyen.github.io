import { PickType } from '@nestjs/swagger';
import { CreateMangaDto } from './create-manga.dto';

export class UpdateMangaCategoryDto extends PickType(CreateMangaDto, [
  'category_id',
] as const) {}
