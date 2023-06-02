import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email addresss' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
