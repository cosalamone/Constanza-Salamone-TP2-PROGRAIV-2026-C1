import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly _UserModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this._UserModel.create(createUserDto)
    return createdUser;
  }

  async findAll() {
    const allUsers = await this._UserModel.find();
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this._UserModel.findById(id);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userUpdate = await this._UserModel.updateOne({ _id: id }, updateUserDto);
    return userUpdate;
  }

  async remove(id: string) {
    const userRemoved = await this._UserModel.deleteOne({ _id: id });
    return userRemoved;
  }
}
