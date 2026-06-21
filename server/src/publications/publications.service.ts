import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publication } from './entities/publication.schema';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CLOUDINARY } from '../cloudinary/cloudinary.provider';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectModel('Publication') private readonly publicationModel: Model<Publication>,
    @InjectModel('User') private readonly userModel: Model<any>,
    @Inject(CLOUDINARY) private readonly _cloudinary: any,
  ) {}

  // region Publicaciones
  public async create(
    createPublicationDto: CreatePublicationDto,
    userId: string,
  ): Promise<Publication> {
    const imageUrl = createPublicationDto.imageUrl
      ? await this._uploadImage(createPublicationDto.imageUrl)
      : undefined;

    return this.publicationModel.create({
      title: createPublicationDto.title,
      description: createPublicationDto.description,
      imageUrl,
      userId,
    });
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

    let publications: any[];
    let total: number;

    if (sort === 'likes') {
      const sortedIds = await this.publicationModel
        .aggregate([
          { $match: filter },
          { $addFields: { likesCount: { $size: '$likes' } } },
          { $sort: { likesCount: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $project: { _id: 1 } },
        ])
        .exec();

      const ids = sortedIds.map((d: any) => d._id);

      publications = await this.publicationModel
        .find({ _id: { $in: ids } })
        .populate('userId', 'name lastName username profileImage')
        .populate('comments.user', 'name lastName username profileImage')
        .populate('likes', 'name lastName')
        .exec();

      const idOrder = new Map(ids.map((id: any, idx: number) => [id.toString(), idx]));
      publications.sort((a: any, b: any) => (idOrder.get(a._id.toString()) ?? 0) - (idOrder.get(b._id.toString()) ?? 0));

      total = await this.publicationModel.countDocuments(filter).exec();
    } else {
      [publications, total] = await Promise.all([
        this.publicationModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('userId', 'name lastName username profileImage')
          .populate('comments.user', 'name lastName username profileImage')
          .populate('likes', 'name lastName')
          .exec(),
        this.publicationModel.countDocuments(filter).exec(),
      ]);
    }

    return {
      publications: publications.map((pub) => this._mapPublication(pub, currentUserId)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async remove(id: string, userId: string) {
    const publication = await this._findPublication(id);

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isAuthor = publication.userId.toString() === userId;
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('No tenés permiso para eliminar esta publicación');
    }

    publication._deleted = true;
    await publication.save();

    return { message: 'Publicación eliminada correctamente' };
  }
  // endregion Publicaciones

  public async findOne(id: string, currentUserId?: string) {
    const publication = await this.publicationModel
      .findById(id)
      .populate('userId', 'name lastName username profileImage')
      .populate('comments.user', 'name lastName username profileImage')
      .populate('likes', 'name lastName')
      .exec();

    if (!publication || publication._deleted) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return this._mapPublication(publication, currentUserId);
  }

  // region Likes

  private async _toggleLike(id: string, userId: string, add: boolean) {
    const update = add
      ? { $addToSet: { likes: new Types.ObjectId(userId) } }
      : { $pull: { likes: new Types.ObjectId(userId) } };

    const publication = await this.publicationModel
      .findByIdAndUpdate(id, update, { new: true })
      .select('likes')
      .exec();

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return {
      id: publication._id,
      likes: publication.likes?.length ?? 0,
      isLikedByCurrentUser:
        publication.likes?.some((l: any) => l.toString() === userId) ?? false,
    };
  }

  async addLike(id: string, userId: string) {
    return this._toggleLike(id, userId, true);
  }

  async removeLike(id: string, userId: string) {
    return this._toggleLike(id, userId, false);
  }
  // endregion Likes

  // region Comentarios
  public async getComments(publicationId: string, page: number, limit: number) {
    const publication = await this._findPublication(publicationId);

    const total = publication.comments.length;
    const sorted = [...publication.comments]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice((page - 1) * limit, page * limit);

    const commentIds = sorted.map((c: any) => c._id.toString());

    await this._populatePublicationComments(publication);
    const populated = publication.comments.filter((c: any) =>
      commentIds.includes(c._id.toString()),
    );

    return {
      comments: populated.map((c: any) => this._mapComment(c)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async addComment(publicationId: string, dto: CreateCommentDto, userId: string) {
    const publication = await this._findPublication(publicationId);

    publication.comments.push({
      text: dto.text,
      user: new Types.ObjectId(userId),
      createdAt: new Date(),
      modified: false,
    });
    await publication.save();

    await this._populatePublicationComments(publication);
    const newComment = publication.comments[publication.comments.length - 1];

    return this._mapComment(newComment);
  }

  public async editComment(
    publicationId: string,
    commentId: string,
    dto: UpdateCommentDto,
    userId: string,
  ) {
    const publication = await this._findPublication(publicationId);
    const comment = this._findComment(publication, commentId);

    if (comment.user.toString() !== userId) {
      throw new ForbiddenException('No tenés permiso para editar este comentario');
    }

    comment.text = dto.text;
    comment.modified = true;
    await publication.save();

    await this._populatePublicationComments(publication);
    const updated = publication.comments.find((c: any) => c._id.toString() === commentId);

    return this._mapComment(updated);
  }
  // endregion Comentarios

  private async _findPublication(id: string) {
    const pub = await this.publicationModel.findById(id).exec();
    if (!pub || pub._deleted) {
      throw new NotFoundException('Publicación no encontrada');
    }
    return pub;
  }

  private _findComment(publication: any, commentId: string) {
    const comment = publication.comments.find((c: any) => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    return comment;
  }

  private _mapComment(c: any) {
    return {
      id: c._id,
      text: c.text,
      user: {
        name: c.user?.name ?? '',
        lastName: c.user?.lastName ?? '',
        username: c.user?.username ?? '',
        profileImage: c.user?.profileImage ?? '',
      },
      createdAt: c.createdAt,
      modified: c.modified,
    };
  }

  private async _populatePublicationComments(pub: any) {
    await pub.populate('comments.user', 'name lastName username profileImage');
    return pub;
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
      comments: (pub.comments ?? []).map((c: any) => this._mapComment(c)),
      createdAt: pub.createdAt,
      isLikedByCurrentUser:
        pub.likes?.some((l: any) => {
          const likeId = (l._id ?? l)?.toString?.() ?? l._id ?? l;
          return currentUserId && likeId === currentUserId;
        }) ?? false,
    };
  }
}
