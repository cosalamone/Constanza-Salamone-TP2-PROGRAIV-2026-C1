import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserType } from '../enums/userType.enum';
import { CLOUDINARY } from '../cloudinary/cloudinary.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    @Inject(CLOUDINARY) private readonly _cloudinary: any,
  ) {}

  async findAll() {
    const users = await this._userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    return users;
  }

  async create(dto: CreateUserDto) {
    const existingUsername = await this._userModel.findOne({ username: dto.username });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya se encuentra registrado.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let profileImageUrl: string | undefined;
    if (dto.profileImage) {
      profileImageUrl = await this._saveProfileImage(dto.username, dto.profileImage);
    }

    const { profileImage, ...dtoWithoutImage } = dto;

    const createdUser = await this._userModel.create({
      ...dtoWithoutImage,
      password: hashedPassword,
      role: dto.role || UserType.USER,
      disabled: false,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    });

    const { password: _, ...userWithoutPassword } = createdUser.toObject();
    return userWithoutPassword;
  }

  async disable(id: string) {
    const user = await this._userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.disabled = true;
    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async enable(id: string) {
    const user = await this._userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.disabled = false;
    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  private async _saveProfileImage(username: string, dataUrl: string): Promise<string> {
    const result = await this._cloudinary.uploader.upload(dataUrl, {
      folder: 'profile-images',
      public_id: `profile-${username}-${Date.now()}`,
    });
    return result.secure_url;
  }
}
