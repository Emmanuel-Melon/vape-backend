import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      // error.errors is an array of ZodIssue objects
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new BadRequestException({ 
        statusCode: 400, 
        message: 'Validation failed',
        errors: validationErrors 
      });
    }
  }
}
