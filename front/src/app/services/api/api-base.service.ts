import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiBaseService {
  protected readonly _apiUrl = environment.apiUrl;

  protected _httpClient = inject(HttpClient);

  constructor() {}
}
