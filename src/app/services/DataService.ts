import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { NewsResults } from "../news";

export class DataService {
  constructor(private url: string,private http:HttpClient) {}

  getNewsFavoritos():Observable<any> {
        return this.http.get(this.url)
        .pipe(catchError(
            (err: any, caught: Observable<any>) => {
                console.log(err);
                return caught;
            }));
  }

  addNewsFavoritos(data: any): Observable<any> {
      return this.http.post<any>("http://localhost:8080/api/noticias/save", data);
  }
}
