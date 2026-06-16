import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publication } from './entities/publication.schema';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CLOUDINARY } from '../cloudinary/cloudinary.provider';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectModel('Publication') private readonly publicationModel: Model<Publication>,
    @Inject(CLOUDINARY) private readonly _cloudinary: any,
  ) {}

  async create(createPublicationDto: CreatePublicationDto, userId: string): Promise<Publication> {
    let imageUrl: string | undefined;

    if (createPublicationDto.imageUrl) {
      imageUrl = await this._uploadImage(createPublicationDto.imageUrl);
    }

    const publication = await this.publicationModel.create({
      title: createPublicationDto.title,
      description: createPublicationDto.description,
      imageUrl,
      userId,
    });

    return publication;
  }

  private async _uploadImage(dataUrl: string): Promise<string> {
    const result = await this._cloudinary.uploader.upload(dataUrl, {
      folder: 'publication-images',
      public_id: `pub-${Date.now()}`,
    });
    return result.secure_url;
  }


}