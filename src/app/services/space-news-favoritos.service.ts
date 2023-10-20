import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpaceNewsFavoritosService {
  private url = 'http://localhost:8080/api/noticias/';

  constructor(private http: HttpClient) {}

  getNewsFavoritos(): Observable<any>{
    return this.http.get(this.url);
  }

  addNewsFavoritos(data: any): Observable<any> {
    return this.http.post<any>(this.url.concat('save'), data);
  }

  deleteFavorito(id: string) {
    console.log("delete",this.url.concat(id))
    return this.http.delete(this.url.concat(id));
  }

}
