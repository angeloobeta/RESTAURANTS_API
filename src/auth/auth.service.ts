import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';

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
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });
      return user;
    } catch (e) {
      // Handling duplicate error
      if (e.code == 11000) {
        console.log(e.message);
        throw new ConflictException('This email has already been used');
      }
    }
  }
}
