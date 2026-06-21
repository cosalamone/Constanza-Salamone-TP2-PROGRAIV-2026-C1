import { Injectable } from '@angular/core';
import { ApiBaseService } from '../api/api-base.service';
import { PublicationRequest } from './publication-request.interface';
import { PublicationResponse } from './publication-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationServices extends ApiBaseService {
  public createPublication(publicationRequest: PublicationRequest): Observable<any> {
    return this._httpClient.post(`${this._apiUrl}/publications`, publicationRequest);
  }

  public deletePublication(id: string): Observable<any> {
    return this._httpClient.delete(`${this._apiUrl}/publications/${id}`);
  }

  public addLike(id: string): Observable<any> {
    return this._httpClient.post(`${this._apiUrl}/publications/${id}/like`, {});
  }

  public removeLike(id: string): Observable<any> {
    return this._httpClient.delete(`${this._apiUrl}/publications/${id}/like`);
  }

  public getPublications(params: {
    page: number;
    limit: number;
    sort: string;
    userId?: string;
  }): Observable<PublicationResponse> {
    const queryParams: any = {
      page: params.page,
      limit: params.limit,
      sort: params.sort,
    };
    if (params.userId) {
      queryParams.userId = params.userId;
    }
    return this._httpClient.get<PublicationResponse>(`${this._apiUrl}/publications`, {
      params: queryParams,
    });
  }

  public getPublicationById(id: string): Observable<any> {
    return this._httpClient.get(`${this._apiUrl}/publications/${id}`);
  }
}
