import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../Model/Story';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  apiurl = 'https://localhost:7160/Stories/GetStories';

  constructor(private http: HttpClient) { }

  // Add pagination parameters to GetStories method
  GetStories(pageNumber: number, pageSize: number): Observable<Story[]> {
    // Create HTTP parameters for pagination
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    // Send HTTP GET request with pagination parameters
    return this.http.get<Story[]>(this.apiurl, { params: params });
  }
}
