import { Test, TestingModule } from '@nestjs/testing';
import { ErrorReportController } from './error-report.controller';
import { ErrorReportService } from './error-report.service';

describe('ErrorReportController', () => {
  let controller: ErrorReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorReportController],
      providers: [ErrorReportService],
    }).compile();

    controller = module.get<ErrorReportController>(ErrorReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
