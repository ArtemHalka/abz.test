import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationException } from '../filters/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new ValidationException({
        message: 'Validation failed',
        fails: this.buildError(errors),
      });
    }
    return value;
  }

  private buildError(errors: ValidationError[]) {
    const result = {};
    errors.forEach((el) => {
      const prop = el.property;
      result[prop] = [...Object.values(el.constraints)];
    });
    return result;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
