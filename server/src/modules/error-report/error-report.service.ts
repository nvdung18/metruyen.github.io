import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateErrorReportDto } from './dto/create-error-report.dto';
import { UserService } from '@modules/user/user.service';
import { ChapterService } from '@modules/chapter/chapter.service';
import { ErrorReportRepo } from './error-report.repo';
import { ErrorReport } from './models/error-report.model';
import Util from '@common/services/util.service';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { ErrorReportDto } from './dto/error-report.dto';
import PaginateUtil from 'src/shared/utils/paginate.util';

@Injectable()
export class ErrorReportService {
  constructor(
    private readonly errorReportRepo: ErrorReportRepo,
    private readonly userService: UserService,
    private readonly chapterService: ChapterService,
    private readonly util: Util,
  ) {}

  async createErrorReport(
    createErrorReportDto: CreateErrorReportDto,
  ): Promise<ErrorReport> {
    const {
      report_chapter_id,
      report_description,
      report_kind_of_error,
      report_user_id,
    } = createErrorReportDto;

    const foundUser = await this.userService.getDetailsInfo(report_user_id);
    if (!foundUser) {
      throw new Error('User not found');
    }

    // Check and return an error if the chapter is not found (returns an Error that is handled in findChapterById)
    await this.chapterService.findChapterById(report_chapter_id);

    const errorReportId = this.util.generateIdByTime({ fitWithInteger: true });
    const errorReportObj = new ErrorReport({
      report_id: errorReportId,
      report_user_id,
      report_chapter_id,
      report_description,
      report_kind_of_error,
    });

    const newErrorReport =
      await this.errorReportRepo.createErrorReport(errorReportObj);

    return newErrorReport;
  }

  async getListErrorReportWithPaginate(
    paginateDto: PaginatedDto<ErrorReportDto>,
    isFixed: boolean,
  ): Promise<PaginatedDto<ErrorReportDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const { data, pagination } =
      await this.errorReportRepo.getListOfErrorReportWithPaginate(
        isFixed,
        page,
        limit,
        {
          raw: true,
        },
      );
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async confirmFixErrorReport(errorReportId: number): Promise<number> {
    const errorReport =
      await this.errorReportRepo.findErrorReportById(errorReportId);

    if (errorReport.is_fixed)
      throw new HttpException(
        'Error report already fixed',
        HttpStatus.BAD_REQUEST,
      );

    errorReport.is_fixed = true;
    const isUpdated = await this.errorReportRepo.updateErrorReport(
      errorReportId,
      errorReport,
    );
    if (!isUpdated) {
      throw new Error('Cannot update error report');
    }
    return isUpdated;
  }

  async deleteErrorReportById(errorReportId: number): Promise<number> {
    await this.errorReportRepo.findErrorReportById(errorReportId);

    const isDeleted =
      await this.errorReportRepo.deleteErrorReportById(errorReportId);
    if (!isDeleted) {
      throw new Error('Cannot delete error report');
    }
    return isDeleted;
  }

  async findErrorReportById(errorReportId: number): Promise<ErrorReport> {
    const errorReport =
      await this.errorReportRepo.findErrorReportById(errorReportId);
    if (!errorReport) {
      throw new Error('Error report not found');
    }
    return errorReport;
  }
}
