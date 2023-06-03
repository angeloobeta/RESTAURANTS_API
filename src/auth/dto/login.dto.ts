import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email addresses' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
