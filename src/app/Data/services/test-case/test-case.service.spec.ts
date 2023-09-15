import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { TestCaseService } from './test-case.service';

describe('TestCaseService', (): void => {
  let service: TestCaseService;
  let httpClientSpy: { get: jasmine.Spy } = jasmine.createSpyObj(
    'HttpClient',
    ['get'],
  );

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        TestCaseService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(TestCaseService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should successfully retrieve test cases from the JSON file', () => {
    // Arrange
    httpClientSpy.get.and.returnValue(of(['test case 1', 'test case 2']));

    // Act
    const result: Observable<string[]> = service.getTestCases();

    // Assert that the result is an Observable of string array
    expect(result).toEqual(jasmine.any(Observable));
    result.subscribe((testCases: string[]): void => {
      // Assert that the test cases are retrieved correctly
      expect(testCases).toEqual(['test case 1', 'test case 2']);
    });
  });

  it('should handle empty JSON file', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(of([]));

    // Act
    const result: Observable<string[]> = service.getTestCases();

    result.subscribe((testCases: string[]): void => {
      // Assert that the test cases are empty
      expect(testCases).toEqual([]);
    });
  });

  it('should handle JSON file not found', (): void => {
    // Arrange
    httpClientSpy.get.and.returnValue(throwError((): string => 'File not found'));

    // Act
    const result: Observable<string[]> = service.getTestCases();

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
    const result: Observable<string[]> = service.getTestCases();

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
