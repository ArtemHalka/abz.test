import { HttpException, HttpStatus } from '@nestjs/common';

export interface IValidationErrorResponse {
  message: string;
  fails: Record<string, string>;
}

export class ValidationException extends HttpException {
  constructor(response: IValidationErrorResponse) {
    super(response, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
