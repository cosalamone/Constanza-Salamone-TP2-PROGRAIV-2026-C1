import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
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

  async findAll(params: {
    page: number;
    limit: number;
    sort: string;
    userId?: string;
    currentUserId?: string;
  }) {
    const { page, limit, sort, userId, currentUserId } = params;

    const filter: any = { _deleted: false };
    if (userId) {
      filter.userId = userId;
    }

    const sortOption: Record<string, SortOrder> = sort === 'likes'
      ? { 'likes.length': -1 }
      : { createdAt: -1 };

    const [publications, total] = await Promise.all([
      this.publicationModel
        .find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name lastName username profileImage')
        .populate('comments.user', 'name lastName username profileImage')
        .populate('likes', 'name lastName')
        .exec(),
      this.publicationModel.countDocuments(filter).exec(),
    ]);

    return {
      publications: publications.map((pub) => this._mapPublication(pub, currentUserId)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private _mapPublication(pub: any, currentUserId?: string) {
    const userId = pub.userId?._id ?? pub.userId;
    return {
      id: pub._id,
      title: pub.title,
      description: pub.description,
      imageUrl: pub.imageUrl,
      userId: userId?.toString?.() ?? userId,
      user: {
        name: pub.userId?.name ?? '',
        lastName: pub.userId?.lastName ?? '',
        username: pub.userId?.username ?? '',
        profileImage: pub.userId?.profileImage ?? '',
      },
      likes: pub.likes?.length ?? 0,
      comments: (pub.comments ?? []).map((c: any) => ({
        id: c._id,
        text: c.text,
        user: {
          name: c.user?.name ?? '',
          lastName: c.user?.lastName ?? '',
          username: c.user?.username ?? '',
          profileImage: c.user?.profileImage ?? '',
        },
        createdAt: c.createdAt,
      })),
      createdAt: pub.createdAt,
      isLikedByCurrentUser:
        pub.likes?.some((l: any) => {
          const likeId = (l._id ?? l)?.toString?.() ?? (l._id ?? l);
          return currentUserId && likeId === currentUserId;
        }) ?? false,
    };
  }
}