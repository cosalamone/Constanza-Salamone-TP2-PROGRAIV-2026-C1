import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), CloudinaryModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
