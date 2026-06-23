import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../api/api-base.service';

export interface PublicationsPerUser {
  userId: string;
  name: string;
  lastName: string;
  username: string;
  count: number;
}

export interface CommentsPerPeriod {
  date: string;
  count: number;
}

export interface CommentsPerPublication {
  title: string;
  commentsCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService extends ApiBaseService {
  constructor() {
    super();
  }

  getPublicationsPerUser(from?: string, to?: string): Observable<PublicationsPerUser[]> {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return this._httpClient.get<PublicationsPerUser[]>(
      `${this._apiUrl}/statistics/publications-per-user`,
      { params },
    );
  }

  getCommentsPerPeriod(from?: string, to?: string): Observable<CommentsPerPeriod[]> {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return this._httpClient.get<CommentsPerPeriod[]>(
      `${this._apiUrl}/statistics/comments-per-period`,
      { params },
    );
  }

  getCommentsPerPublication(from?: string, to?: string): Observable<CommentsPerPublication[]> {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return this._httpClient.get<CommentsPerPublication[]>(
      `${this._apiUrl}/statistics/comments-per-publication`,
      { params },
    );
  }
}
