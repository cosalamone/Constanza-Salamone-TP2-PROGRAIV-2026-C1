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

  public getPublications(params: {
    page: number;
    limit: number;
    sort: string;
    userId?: string;
    currentUserId?: string;
  }): Observable<PublicationResponse> {
    const queryParams: any = {
      page: params.page,
      limit: params.limit,
      sort: params.sort,
    };
    if (params.userId) {
      queryParams.userId = params.userId;
    }
    if (params.currentUserId) {
      queryParams.currentUserId = params.currentUserId;
    }
    return this._httpClient.get<PublicationResponse>(`${this._apiUrl}/publications`, {
      params: queryParams,
    });
  }
}
