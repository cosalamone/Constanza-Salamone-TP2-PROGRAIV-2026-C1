import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiBaseService {

    protected readonly _apiUrl = 'http://localhost:3000';

    protected _httpClient = inject(HttpClient);

    constructor() {  }

}
