import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ForecastData } from '../../../Domain/models/forecast-data.model';

@Injectable({ providedIn: 'root' })
export class ForecastDataService {
  constructor(private http: HttpClient) {
  }

  getForestData(id: number): Observable<ForecastData> {
    return this.http
      .get<ForecastData>(`${environment.dataPath}data_${id}.json`)
      .pipe(
        map((forestData: ForecastData) => forestData)
      );
  }
}
