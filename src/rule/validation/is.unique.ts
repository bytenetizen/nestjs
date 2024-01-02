import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AppService } from '../../app.service';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  private readonly uniqueValues: Set<string> = new Set();
  constructor(private readonly appService: AppService) {}
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    if (this.uniqueValues.has(value)) {
      return false; // Value is not unique
    }
    const firstConstraint =
      args.constraints && args.constraints.length > 0
        ? args.constraints[0]
        : null;

    if (!firstConstraint) {
      throw new Error(
        'Missing required parameters: targetName, property, value',
      );
    }

    const entity = await this.appService.checkUni({
      targetName: firstConstraint,
      property: args.property,
      value: value,
    });
    // this.uniqueValues.add(value);
    return !entity;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const value = validationArguments?.value;
    const property = validationArguments?.property;
    return `The value ${value} of ${property} already exists.`;
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: validationOptions?.context,
      validator: IsUniqueConstraint,
    });
  };
}
