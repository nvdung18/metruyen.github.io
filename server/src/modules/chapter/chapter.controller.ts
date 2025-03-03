import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { AtLeastOneFieldPipe } from '@common/pipes/at-least-one-field.pipe';
import { GuestRole } from '@common/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @ApiOperation({
    summary: 'Add chapter by admin',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Admin can create new chapter to manga
    `,
  })
  @Post(':id')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Manga id',
  })
  @ApiBody({
    description: 'Add chapter',
    schema: {
      type: 'object',
      properties: {
        chap_title: { type: 'string', example: 'Chapter 1: The Beginning' },
        chap_number: { type: 'integer', example: 1 },
        chap_content: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('chap_content'))
  @ResponseMessage('Chapter added successful')
  @AuthorizeAction({ action: 'createAny', resource: 'Chapters' })
  async createChapterForManga(
    @Req() req: Request,
    @Body() createChapterDto: CreateChapterDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') mangaId: number,
  ) {
    const data = await this.chapterService.createChapterForManga(
      createChapterDto,
      files,
      mangaId,
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'Update chapter by admin',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Admin can update chapter
    `,
  })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chapter id',
  })
  @ApiBody({
    description: 'Update chapter',
    type: UpdateChapterDto,
  })
  @UseInterceptors(FilesInterceptor('chap_content'))
  @ResponseMessage('Chapter updated successful')
  @AuthorizeAction({ action: 'updateAny', resource: 'Chapters' })
  async updateChapter(
    @Req() req: Request,
    @Body(new AtLeastOneFieldPipe({ removeAllEmptyField: true }))
    updateChapterDto: UpdateChapterDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') chapterId: number,
  ) {
    const result = await this.chapterService.updateChapterForManga(
      updateChapterDto,
      chapterId,
      files,
    );
    return {
      metadata: result,
      // metadata: 1,
    };
  }

  @ApiOperation({
    summary: 'Get all chapters of manga',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Admin can See more information.
    `,
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Manga id',
  })
  @ResponseMessage('Get all Chapters of manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Chapters' })
  @GuestRole(true)
  async getAllChaptersByMangaId(
    @Req() req: Request,
    @Param('id') mangaId: number,
  ) {
    const data = await this.chapterService.getAllChaptersByMangaId(mangaId);
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'See details chapters',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Admin can See more information.
    `,
  })
  @Get('/details/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Manga id',
  })
  @ApiQuery({
    name: 'chapter',
    type: Number,
    description: 'Chapter of manga',
  })
  @ResponseMessage('Get details chapter of manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Chapters' })
  @GuestRole(true)
  async getDetailsOfChapterByChapNumber(
    @Req() req: Request,
    @Param('id') mangaId: number,
    @Query('chapter') chapter: number,
  ) {
    const data = await this.chapterService.getDetailsOfChapterByChapNumber(
      mangaId,
      chapter,
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'Increase views of chapter',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
    `,
  })
  @Patch('/views/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Manga id',
  })
  @ApiQuery({
    name: 'chapter',
    type: Number,
    description: 'Chapter of manga',
  })
  @ResponseMessage('Increase views of chapter successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Chapters' })
  @GuestRole(true)
  async increaseViewOfChapter(
    @Req() req: Request,
    @Param('id') mangaId: number,
    @Query('chapter') chapter: number,
  ) {
    const data = await this.chapterService.increaseViewOfChapter(
      mangaId,
      chapter,
    );
    return {
      metadata: data,
    };
  }

  // @Post('upload')
  // @ApiOperation({ summary: 'Upload chapter images' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Upload multiple images for a chapter',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       chap_title: { type: 'string', example: 'Chapter 1: The Beginning' },
  //       chap_number: { type: 'integer', example: 1 },
  //       chap_content: {
  //         type: 'array',
  //         items: { type: 'string', format: 'binary' },
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FilesInterceptor('chap_content', 10))
  // async uploadFiles(
  //   @Body() body: CreateChapterDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   return {
  //     metadata: {
  //       ...body,
  //     },
  //   };
  // }
}
