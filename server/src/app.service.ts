import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  getHello(): string {
    // this.logger.log({
    //   level: 'warn',
    //   message: 'This is warn level',
    //   refCode: '456789',
    // });

    // this.logger.log({
    //   level: 'info',
    //   message: 'This is Info level',
    //   refCode: 300,
    //   metadata: 11111,
    // });
    // try {
    //   throw new Error('Some random error');
    // } catch (err) {
    //   // pass err to print stack trace also
    //   this.logger.error({
    //     level: 'error',
    //     message: 'This is Error level',
    //     err: err,
    //     refCode: 200,
    //   });
    // }
    return 'Hello World!';
  }
}
