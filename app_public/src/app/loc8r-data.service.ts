import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './home-list/home-list.component';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {
  constructor(private http: HttpClient) {}

  private apiBaseUrl = 'http://localhost:3000/api/';

  public getLocations(): Promise<Location[]> {
    const lng = -0.8;
    const lat = 51.378091;
    const maxDist = 20000;
    const maxResults = 10;
    const url = `${
      this.apiBaseUrl
    }/locations?lng=${lng}&lat=${lat}&maxDist=${maxDist}&maxResults=${maxResults}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: Location[]) => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
