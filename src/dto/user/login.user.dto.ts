import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

//TODO  @IsEmail сменить на возможность вводить номер телефона
export class LoginUserDto {
  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @IsEmail({}, { message: 'validation.emailFormat' })
  @MinLength(5, { message: 'validation.badMinLength' })
  @MaxLength(100, { message: 'validation.badMaxLength' })
  contact: string;

  @IsString({ message: 'validation.string' })
  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(5, { message: 'validation.badMinLength' })
  @MaxLength(50, { message: 'validation.badMaxLength' })
  // @CheckPassword()
  password: string;
}
