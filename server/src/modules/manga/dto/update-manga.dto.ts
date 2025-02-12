import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMangaDto } from './create-manga.dto';
import { IsEnum, IsOptional, Validate } from 'class-validator';

export enum MangaStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  HIATUS = 'hiatus',
}
export class UpdateMangaDto extends PartialType(
  OmitType(CreateMangaDto, ['category_id' as const]),
) {
  @ApiPropertyOptional({
    enum: MangaStatus,
    description: 'The status of the manga',
    example: MangaStatus.ONGOING,
  })
  @IsEnum(MangaStatus, { message: 'Invalid manga status' })
  @IsOptional()
  manga_status: MangaStatus;
}
