import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AppService } from '../../app.service';

@ValidatorConstraint({ name: 'checkDateBirth', async: true })
@Injectable()
export class CheckDateBirthConstraint implements ValidatorConstraintInterface {
  constructor(private readonly appService: AppService) {}
  async validate(value: string): Promise<boolean> {
    const entity = await this.appService.isCheckDateBirth(value);

    return !!entity;
  }

  defaultMessage(): string {
    const { minYears, maxYears } = this.appService.getYears();
    return `validation.between_${minYears}_${maxYears}`;
  }
}

export function CheckDateBirth(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: validationOptions?.context,
      validator: CheckDateBirthConstraint,
    });
  };
}
