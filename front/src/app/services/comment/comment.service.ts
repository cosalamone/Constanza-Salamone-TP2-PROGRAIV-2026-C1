import { Injectable } from '@angular/core';
import { ApiBaseService } from '../api/api-base.service';
import { CommentRequest, CommentsPageResponse, CommentResponse } from './comment.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService extends ApiBaseService {
  public getComments(
    publicationId: string,
    page: number,
    limit: number,
  ): Observable<CommentsPageResponse> {
    return this._httpClient.get<CommentsPageResponse>(
      `${this._apiUrl}/publications/${publicationId}/comments`,
      { params: { page, limit } },
    );
  }

  public addComment(
    publicationId: string,
    dto: CommentRequest,
  ): Observable<CommentResponse> {
    return this._httpClient.post<CommentResponse>(
      `${this._apiUrl}/publications/${publicationId}/comments`,
      dto,
    );
  }

  public editComment(
    publicationId: string,
    commentId: string,
    dto: CommentRequest,
  ): Observable<CommentResponse> {
    return this._httpClient.put<CommentResponse>(
      `${this._apiUrl}/publications/${publicationId}/comments/${commentId}`,
      dto,
    );
  }
}
