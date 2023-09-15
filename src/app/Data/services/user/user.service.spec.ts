import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', (): void => {
  let service: UserService;
  let httpClientSpy: { get: jasmine.Spy } = jasmine.createSpyObj(
    'HttpClient',
    ['get'],
  );

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of string array when the http request is successful', (): void => {
    // Arrange
    const mockData: string[] = ['user1', 'user2'];
    httpClientSpy.get.and.returnValue(of(mockData));

    // Act
    const result: Observable<string[]> = service.getUsers();

    // Assert
    expect(result).toEqual(jasmine.any(Observable));
    result.subscribe((data: string[]): void => {
      expect(data).toEqual(mockData);
    });
  });

  it('should return an observable of empty array when the http request returns no data', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(of([]));

    // Act
    const result: Observable<string[]> = service.getUsers();

    // Assert
    expect(result).toEqual(jasmine.any(Observable));
    result.subscribe((data: string[]): void => {
      expect(data).toEqual([]);
    });
  });

  it('should return an observable of error when the http request fails', (): void => {
    // Arrange
    const error: Error = new Error('HTTP request failed');
    httpClientSpy.get.and.returnValue(throwError(() => error));

    // Act
    const result: Observable<string[]> = service.getUsers();

    // Assert
    expect(result).toEqual(jasmine.any(Observable));
    result.subscribe({
      error: (err): void => {
        expect(err).toEqual(error);
      },
    });
  });
});
