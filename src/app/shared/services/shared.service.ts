import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  apiUrl = environment.baseUrl

  constructor (private http: HttpClient, private route: Router) {}

  setToken (token: string) {
    localStorage.setItem('lifeMToken', token)
  }

  getToken () {
    return localStorage.getItem('lifeMToken')
  }

  isLogedIn () {
    return this.getToken() !== null
  }
  
  loginUser (params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    return this.http.post<any>(this.apiUrl + 'sub-admin/login', params, {
      headers: headers
    })
  }

  getApi(url: any): Observable<any> {
    const authToken = localStorage.getItem('lifeMToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    })
    return this.http.get(this.apiUrl + url, { headers: headers })
  }

  postAPI(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('lifeMToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${authToken}`
    })
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  }

  postAPIFormData(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('lifeMToken')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    })
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  }

  deleteAcc(url: any): Observable<any> {
    const authToken = localStorage.getItem('lifeMToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete(this.apiUrl + url, { headers: headers })
  };

  private refreshSidebarSource = new BehaviorSubject<void | null>(null);
  refreshSidebar$ = this.refreshSidebarSource.asObservable();

  triggerRefresh() {
    this.refreshSidebarSource.next(null);
  }
  

  logout() {
    localStorage.removeItem('userIdForPet');
    localStorage.removeItem('lifeMToken');
    this.route.navigateByUrl('/login');
  }

  private photoAlbumData: any;

  setData(data: any) {
    this.photoAlbumData = data;
  }

  getData() {
    return this.photoAlbumData;
  }

  clearData() {
    this.photoAlbumData = null;
  }

  private history: any[] = [];

  // Add state to history
  addToHistory(state: any) {
    this.history.push(state);
  }

  // Remove and return the last state
  popFromHistory(): any {
    return this.history.pop();
  }

  // Get the current history
  getHistory(): any[] {
    return [...this.history]; // Return a copy of the history
  }

  // Clear history
  clearHistory() {
    this.history = [];
  }

  
}
