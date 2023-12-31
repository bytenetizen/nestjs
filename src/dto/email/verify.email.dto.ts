import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(5, { message: 'validation.badMinLength' })
  @MaxLength(100, { message: 'validation.badMaxLength' })
  id: string;

  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(5, { message: 'validation.badMinLength' })
  @MaxLength(50, { message: 'validation.badMaxLength' })
  hash: string;
}
