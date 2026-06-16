import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PublicationSchema } from './entities/publication.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Publication', schema: PublicationSchema }]),
    CloudinaryModule,
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
