import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class AtLeastOneFieldPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
