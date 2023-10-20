import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpaceNewsService {
  constructor(private http: HttpClient) { }
  public getNews(): Observable<any>{
//    return this.http.get("https://api.spaceflightnewsapi.net/v4/articles/?limit=1000000");
    return this.http.get("https://api.spaceflightnewsapi.net/v4/articles");
  }
}
