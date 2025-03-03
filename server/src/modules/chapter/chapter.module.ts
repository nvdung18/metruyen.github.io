import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter } from './models/chapter.model';
import { ChapterRepo } from './chapter.repo';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { MangaModule } from '@modules/manga/manga.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chapter]),
    CloudinaryModule,
    MangaModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService, ChapterRepo],
  exports: [SequelizeModule, ChapterService, ChapterRepo],
})
export class ChapterModule {}
