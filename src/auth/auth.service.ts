import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  // Register User
  async signUp(signUPDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUPDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch (e) {
      // Handling duplicate error
      if (e.code == 11000) {
        console.log(e.message);
        throw new ConflictException('This email has already been used');
      }
    }
  }

  //Login user
  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    // This line will fetch only the hashed password and _id
    // const user = await this.userModel.findOne({ email }).select('password');
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid email address or password.');
    }
    // verify if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email address or password.');
    }
    return user;
  }
}
