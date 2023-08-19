import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestCaseService {
  constructor(private http: HttpClient) {
  }

  getTestCases(): Observable<string[]> {
    return this.http
      .get<string[]>(`${environment.dataPath}test_cases.json`)
      .pipe(
        map((testCases: string[]) => testCases)
      );
  }
}
