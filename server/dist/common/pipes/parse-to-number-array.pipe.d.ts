import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseToNumberArrayPipe<T> implements PipeTransform<T[], number[]> {
    transform(value: T[], metadata: ArgumentMetadata): number[];
}
