import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './location';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {
  constructor(private http: HttpClient) {}

  // private apiBaseUrl = 'http://localhost:3000/api/';
  private apiBaseUrl = environment.apiURL;

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    const maxDist = 999999999999;
    const maxResults = 10;
    const url = `${
      this.apiBaseUrl
    }locations?lng=${lng}&lat=${lat}&maxDist=${maxDist}&maxResults=${maxResults}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: Location[]) => response)
      .catch(this.handleError);
  }

  public getLocationById(locationId: string): Promise<Location> {
    const url = `${this.apiBaseUrl}locations/${locationId}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: Location) => response)
      .catch(this.handleError);
  }

  public addReviewByLocationId(
    locationId: string,
    formData: Review
  ): Promise<Review> {
    const url = `${this.apiBaseUrl}locations/${locationId}/reviews`;
    return this.http
      .post(url, formData)
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
