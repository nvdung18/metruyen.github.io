import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class AtLeastOneFieldPipe implements PipeTransform {
    removeAllEmptyField: boolean;
    constructor({ removeAllEmptyField, }?: {
        removeAllEmptyField?: boolean;
    });
    transform(value: any, metadata: ArgumentMetadata): any;
    private executeRemoveAllEmptyField;
}
