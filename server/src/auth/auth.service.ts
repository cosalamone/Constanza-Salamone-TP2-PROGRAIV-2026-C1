import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly _userModel: Model<User>) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUsername = await this._userModel.findOne({ username: registerAuthDto.username });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya se encuentra registrado.');
    }

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    const createdUser = await this._userModel.create({
      ...registerAuthDto,
      password: hashedPassword,
      role: registerAuthDto.role || 'usuario',
    });

    const { password, ...userWithoutPassword } = createdUser.toObject();
    return userWithoutPassword;
  }

  async login(username: string, password: string) {
    const user = await this._userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
