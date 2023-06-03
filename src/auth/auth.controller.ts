import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Controller('auth/')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Register a new user
  @Post('sign-up/')
  signUP(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login/')
  loginIn(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
