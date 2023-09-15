import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { ForecastData } from '../../../Domain/models/forecast-data.model';
import { ForecastDataService } from './forecast-data.service';

describe('ForecastDataService', (): void => {
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

  it('should return data with correct structure and values when given a valid id', (): void => {
    // Mock the http.get method to return a mock Observable
    const mockResponse: ForecastData = { location: 'forest', data: [], yMaxValue: 100 };
    // Arrange
    httpClientSpy.get.and.returnValue(of(mockResponse));

    // Act
    const result: Observable<ForecastData> = service.getForestData(1);

    // Assert that the result has the correct structure and values
    result.subscribe((forecastData: ForecastData) => {
      expect(forecastData.location).toBe('forest');
      expect(forecastData.data).toEqual([]);
      expect(forecastData.yMaxValue).toBe(100);
    });
  });

  it('should handle JSON file not found', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(throwError((): string => 'File not found'));

    // Act
    const result: Observable<ForecastData> = service.getForestData(132);

    // Assert that the result is an Observable of error
    expect(result).toEqual(jasmine.any(Observable));
    result.subscribe({
      next: (): void => {
        fail('Expected error to be thrown');
      },
      error: (error): void => {
        expect(error).toBe('File not found');
      }
    });
  });

  it('should handle JSON file with invalid format', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(throwError((): string => 'Invalid JSON'));

    // Act
    const result: Observable<ForecastData> = service.getForestData(31);

    // Assert that the result is an Observable of error
    expect(result).toEqual(jasmine.any(Observable));
    result.subscribe({
      next: (): void => {
        fail('Expected error to be thrown');
      },
      error: (error): void => {
        expect(error).toBe('Invalid JSON');
      }
    });
  });
});
