import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publication } from '../publications/entities/publication.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel('Publication') private readonly publicationModel: Model<Publication>,
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async publicationsPerUser(from?: string, to?: string) {
    const match: any = { _deleted: false };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const result = await this.publicationModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          lastName: '$user.lastName',
          username: '$user.username',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    return result;
  }

  async commentsPerPeriod(from?: string, to?: string) {
    const match: any = { _deleted: false };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const result = await this.publicationModel.aggregate([
      { $match: match },
      { $unwind: '$comments' },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$comments.createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    return result;
  }

  async commentsPerPublication(from?: string, to?: string) {
    const match: any = { _deleted: false };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const result = await this.publicationModel.aggregate([
      { $match: match },
      {
        $project: {
          title: 1,
          commentsCount: { $size: '$comments' },
        },
      },
      { $sort: { commentsCount: -1 } },
      { $limit: 20 },
    ]);

    return result;
  }
}
