import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUnique } from '../../rule/validation/is.unique';
import { CheckDateBirth } from '../../rule/validation/check.date.birth';
import { CheckPassword } from '../../rule/validation/check.password';

//TODO @IsUnique
export class CreateUserDto {
  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @IsEmail({}, { message: 'validation.emailFormat' })
  @MinLength(5, { message: 'validation.badMinLength' })
  @MaxLength(100, { message: 'validation.badMaxLength' })
  @IsUnique({ context: ['user', 1] })
  email: string;

  @IsOptional()
  @IsString({ message: 'validation.string' })
  @MinLength(2, { message: 'validation.badMinLength' })
  @MaxLength(50, { message: 'validation.badMaxLength' })
  nic: string;

  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(2, { message: 'validation.badMinLength' })
  @MaxLength(50, { message: 'validation.badMaxLength' })
  name: string;

  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(2, { message: 'validation.badMinLength' })
  @MaxLength(50, { message: 'validation.badMaxLength' })
  lastname: string;

  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @CheckDateBirth()
  birthday: Date;

  @IsNotEmpty({ message: 'validation.required' })
  @IsIn(['1', '2', '3'], { message: 'validation.invalidField' })
  @MaxLength(1, { message: 'validation.max_1' })
  gender: number;

  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(5, { message: 'validation.badMinLength' })
  @MaxLength(50, { message: 'validation.badMaxLength' })
  @CheckPassword()
  password: string;

  @IsOptional()
  @IsString({ message: 'validation.string' })
  @MinLength(2, { message: 'validation.badMinLength' })
  @MaxLength(100, { message: 'validation.badMaxLength' })
  fingerprint: string;
}
