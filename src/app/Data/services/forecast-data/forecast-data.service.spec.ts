import { Observable, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { ForecastData } from '../../../Domain/models/forecast-data.model';
import { ForecastDataService } from './forecast-data.service';

describe('forecastDataService', (): void => {
  let service: ForecastDataService;
  let httpClientSpy: { get: jasmine.Spy } = jasmine.createSpyObj(
    'HttpClient',
    ['get']
  );
  const forecastData: ForecastData = {
    location: 'Hollenthon',
    data: [
      {
        Time: '2022-12-19T06:00:00Z',
        WIND_GUST_ACC: 0,
        WIND_GUST: 18,
        Warning: 0,
        Validity: '',
        Intensity: ''
      },
      {
        Time: '2022-12-19T07:00:00Z',
        WIND_GUST_ACC: 0,
        WIND_GUST: 18,
        Warning: 0,
        Validity: '',
        Intensity: ''
      },
      {
        Time: '2022-12-19T08:00:00Z',
        WIND_GUST_ACC: 0,
        WIND_GUST: 17,
        Warning: 0,
        Validity: '',
        Intensity: ''
      },
    ],
    yMaxValue: 18,
  };

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        ForecastDataService,
        { provide: HttpClient, useValue: httpClientSpy }
      ],
    });
    service = TestBed.inject(ForecastDataService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of ForecastData', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(of(forecastData));

    // Act
    const result: Observable<ForecastData> = service.getForestData(1);

    // Assert
    expect(result).toEqual(jasmine.any(Observable));
  });

  it('should return the expected ForecastData object', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(of(forecastData));

    // Act
    const result: Observable<ForecastData> = service.getForestData(5);

    // Assert
    result.subscribe((data: ForecastData) => expect(data).toEqual(forecastData));
  });

  it('should return an empty Observable when given an invalid id', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(of(null));

    // Act
    const result: Observable<ForecastData> = service.getForestData(-1);

    // Assert
    result.subscribe((data: ForecastData) => expect(data).toBeNull());
  });
});
