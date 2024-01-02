import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AppService } from '../../app.service';

@ValidatorConstraint({ name: 'checkPassword', async: true })
@Injectable()
export class CheckPasswordConstraint implements ValidatorConstraintInterface {
  constructor(private readonly appService: AppService) {}
  async validate(value: string): Promise<boolean> {
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const value = validationArguments?.value;
    const property = validationArguments?.property;
    return `The value ${value} of ${property} already exists.`;
  }
}

export function CheckPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: validationOptions?.context,
      validator: CheckPasswordConstraint,
    });
  };
}
