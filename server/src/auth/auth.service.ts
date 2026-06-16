import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CLOUDINARY } from '../cloudinary/cloudinary.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    @Inject(CLOUDINARY) private readonly _cloudinary: any,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUsername = await this._userModel.findOne({ username: registerAuthDto.username });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya se encuentra registrado.');
    }

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    let profileImageUrl: string | undefined;
    if (registerAuthDto.profileImage) {
      profileImageUrl = await this._saveProfileImage(registerAuthDto.username, registerAuthDto.profileImage);
    }

    const { profileImage, ...dtoWithoutImage } = registerAuthDto;

    const createdUser = await this._userModel.create({
      ...dtoWithoutImage,
      password: hashedPassword,
      role: registerAuthDto.role || 'usuario',
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    });

    const { password, ...userWithoutPassword } = createdUser.toObject();
    return userWithoutPassword;
  }

  private async _saveProfileImage(username: string, dataUrl: string): Promise<string> {
    const result = await this._cloudinary.uploader.upload(dataUrl, {
      folder: 'profile-images',
      public_id: `profile-${username}-${Date.now()}`,
    });

    return result.secure_url;
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
