import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class AtLeastOneFieldPipe implements PipeTransform {
  removeAllEmptyField: boolean;
  constructor({
    removeAllEmptyField = false,
  }: {
    removeAllEmptyField?: boolean;
  } = {}) {
    this.removeAllEmptyField = removeAllEmptyField;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (this.removeAllEmptyField)
      value = this.executeRemoveAllEmptyField(value);
    if (
      Object.keys(value).length === 0 ||
      Object.values(value).some((val) => val === undefined || val === null)
    ) {
      throw new BadRequestException(
        'At least one field must be provided or some value is undefined, null',
      );
    }
    return value;
  }

  private executeRemoveAllEmptyField(value: any) {
    value = Object.fromEntries(
      Object.entries(value).filter(
        ([_, val]) =>
          val !== '' && // Remove empty strings
          val !== -1 && // Remove -1 values
          val !== null && // Remove null values
          val !== undefined && // Remove undefined values
          (!Array.isArray(val) || val.length > 0), // Remove empty arrays
      ),
    );
    return value;
  }
}
