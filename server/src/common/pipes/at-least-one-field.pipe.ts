import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class AtLeastOneFieldPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !value ||
      Object.values(value).some((val) => val === undefined || val === null)
    ) {
      throw new BadRequestException(
        'At least one field must be provided or some value is undefined, null',
      );
    }
    return value;
  }
}
