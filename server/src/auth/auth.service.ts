import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CLOUDINARY } from '../cloudinary/cloudinary.provider';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly _secret: string;

  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    @Inject(CLOUDINARY) private readonly _cloudinary: any,
    private readonly _configService: ConfigService,
  ) {
    const secret = this._configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Falta JWT_SECRET en .env');
    }
    this._secret = secret;
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUsername = await this._userModel.findOne({ username: registerAuthDto.username });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya se encuentra registrado.');
    }

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    let profileImageUrl: string | undefined;
    if (registerAuthDto.profileImage) {
      profileImageUrl = await this._saveProfileImage(
        registerAuthDto.username,
        registerAuthDto.profileImage,
      );
    }

    const { profileImage, ...dtoWithoutImage } = registerAuthDto;

    const createdUser = await this._userModel.create({
      ...dtoWithoutImage,
      password: hashedPassword,
      role: registerAuthDto.role || 'usuario',
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    });

    // Generar token
    const { password, ...userWithoutPassword } = createdUser.toObject();
    const access_token = this._generateToken(userWithoutPassword);
    console.log(access_token);
    return { user: userWithoutPassword, access_token };
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
      throw new UnauthorizedException({
        message: 'Credenciales inválidas.',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Credenciales inválidas.',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    if (user.disabled) {
      throw new UnauthorizedException({
        message: 'Usuario deshabilitado. Contacte al administrador.',
        errorCode: 'USER_DISABLED',
      });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    const access_token = this._generateToken(userWithoutPassword);

    return { user: userWithoutPassword, access_token };
  }

  async validateToken(userId: string) {
    const user = await this._userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    return user;
  }

  async refreshToken(userId: string) {
    const user = await this._userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    const access_token = this._generateToken(user.toObject());
    return { access_token };
  }

  private _generateToken(user): string {
    const payload = {
      sub: user._id?.toString() ?? user.id,
      username: user.username,
      role: user.role,
    };

    const jwt = sign(payload, this._secret, { algorithm: 'HS256', expiresIn: '15m' });
    return jwt;
  }
}
