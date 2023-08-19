import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<string[]> {
    return this.http
      .get<string[]>('../../../assets/data/users.json')
      .pipe(
        map((users: string[]) => users)
      );
  }
}
