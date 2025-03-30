import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorReportService } from './error-report.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { CreateErrorReportDto } from './dto/create-error-report.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiPaginateQuery } from '@common/decorators/api-paginate-query.decorator';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { ErrorReportDto } from './dto/error-report.dto';

@ApiBearerAuth()
@Controller('error-report')
export class ErrorReportController {
  constructor(private readonly errorReportService: ErrorReportService) {}

  @ApiOperation({
    summary: 'User report error of chapter',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
        `,
  })
  @Post('')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    description: 'Create error report',
    type: CreateErrorReportDto,
  })
  @ResponseMessage('Error report successfully')
  @AuthorizeAction({ action: 'createAny', resource: 'Error Reports' })
  async createErrorReport(
    @Req() req: Request,
    @Body() createErrorReport: CreateErrorReportDto,
  ) {
    const data =
      await this.errorReportService.createErrorReport(createErrorReport);
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'Admin view list of error reports',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only admin can use this api
        `,
  })
  @Get('reports')
  @ResponseMessage('Get list error reports successfully')
  @AuthorizeAction({ action: 'readAny', resource: 'Error Reports' })
  @ApiPaginateQuery()
  async getListErrorReports(
    @Req() req: Request,
    @Query('isFixed', ParseBoolPipe) isFixed: boolean,
    @Query() paginateDto: PaginatedDto<ErrorReportDto>,
  ) {
    const data: PaginatedDto<ErrorReportDto> =
      await this.errorReportService.getListErrorReportWithPaginate(
        paginateDto,
        isFixed,
      );
    const { results, ...pagination } = data;
    return {
      metadata: req['permission'].filter(results),
      option: {
        pagination,
      },
    };
  }

  @ApiOperation({
    summary: 'Admin confirm fix error report',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only admin can use this api
        `,
  })
  @Patch('fix/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of error report',
  })
  @ResponseMessage('Confirm fix error report successfully')
  @AuthorizeAction({ action: 'updateAny', resource: 'Error Reports' })
  async confirmFixErrorReport(@Param('id') reportId: number) {
    return {
      metadata: await this.errorReportService.confirmFixErrorReport(reportId),
    };
  }

  @ApiOperation({
    summary: 'Admin delete error report',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only admin can use this api
        `,
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of error report',
  })
  @ResponseMessage('Delete error report successfully')
  @AuthorizeAction({ action: 'deleteAny', resource: 'Error Reports' })
  async deleteErrorReport(@Param('id') reportId: number) {
    return {
      metadata: await this.errorReportService.deleteErrorReportById(reportId),
    };
  }
}
