import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ErrorReport } from './models/error-report.model';
import PaginateUtil from 'src/shared/utils/paginate.util';

@Injectable()
export class ErrorReportRepo {
  constructor(
    @InjectModel(ErrorReport) private errorReportModel: typeof ErrorReport,
  ) {}

  async createErrorReport(
    errorReport: ErrorReport,
    options: object = {},
  ): Promise<ErrorReport> {
    return await this.errorReportModel.create(errorReport.toJSON(), options);
  }

  async getListOfErrorReportWithPaginate(
    isFixed: boolean,
    page: number,
    limit: number,
    option: object = {},
  ): Promise<any> {
    const offset = (page - 1) * limit;
    const { rows: data, count: total } =
      await this.errorReportModel.findAndCountAll({
        where: { is_fixed: isFixed },
        ...option,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
      });
    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async findErrorReportById(
    errorReportId: number,
    options: object = {},
  ): Promise<ErrorReport> {
    return await this.errorReportModel.findOne({
      where: { report_id: errorReportId },
      ...options,
    });
  }

  async updateErrorReport(
    errorReportId: number,
    errorReport: Partial<ErrorReport>,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.errorReportModel.update(
      errorReport.toJSON(),
      {
        where: { report_id: errorReportId },
        ...options,
      },
    );
    return affectedCount;
  }

  async deleteErrorReportById(
    errorReportId: number,
    options: object = {},
  ): Promise<number> {
    return await this.errorReportModel.destroy({
      where: { report_id: errorReportId },
      ...options,
    });
  }
}
