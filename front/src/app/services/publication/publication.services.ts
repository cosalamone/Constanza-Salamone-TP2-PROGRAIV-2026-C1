import { Injectable } from '@angular/core';
import { ApiBaseService } from '../api/api-base.service';
import { PublicationRequest } from './publication-request.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationServices extends ApiBaseService {
  public createPublication(publicationRequest: PublicationRequest): Observable<any> {
    return this._httpClient.post(`${this._apiUrl}/publications`, publicationRequest);
  }

  public getPublications(): Observable<any> {
    return this._httpClient.get(`${this._apiUrl}/publications`);
  }
}
