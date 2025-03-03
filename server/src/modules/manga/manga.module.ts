import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Manga } from './models/manga.model';
import { MangaRepo } from './manga.repo';
import { MangaCategory } from './models/manga-category.model';
import { ChapterModule } from '@modules/chapter/chapter.module';

@Module({
  imports: [SequelizeModule.forFeature([Manga, MangaCategory])],
  controllers: [MangaController],
  providers: [MangaService, MangaRepo],
  exports: [MangaService, MangaRepo],
})
export class MangaModule {}
