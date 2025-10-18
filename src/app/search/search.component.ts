import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


interface SearchParams {
  term: string | null;
  color: string | null;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  searchParams: SearchParams = {
    term: null,
    color: null
  };

  results: any[] = [];
  formValid: boolean | null = null;
  error: boolean = false;
  loader: boolean = false;

  private apiUrl = 'http://localhost:5001/search';
  private storageKey = 'searchResults';
  private paramsKey = 'searchParams';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const storedResults = sessionStorage.getItem(this.storageKey);
    const storedParams = sessionStorage.getItem(this.paramsKey);

    if (storedResults && storedParams) {
      try {
        this.results = JSON.parse(storedResults);
        this.searchParams = JSON.parse(storedParams);

        sessionStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.paramsKey);
      } catch (e) {
        console.error('Failed to parse stored session data:', e);
        this.results = [];
        this.searchParams = { term: '', color: 'blue' };
      }
    } else {
      this.results = [];
      this.searchParams = { term: '', color: 'blue' };
    }
  }

  getSearchResults(paramsObj: SearchParams): Observable<any> {
    let params = new HttpParams();

    if (paramsObj.term) {
      params = params.set('term', paramsObj.term);
    }

    if (paramsObj.color) {
      params = params.set('color', paramsObj.color);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  onSearch(): void {
    this.loader = true;
    this.formValid = true;

    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.paramsKey);
    this.getSearchResults(this.searchParams).subscribe({
      next: (data) => {
        this.results = Array.isArray(data.matches) ? data.matches : [data.matches];
        this.loader = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.results = [];
        this.error = true;
        this.loader = false;
      }
    });
  }

  saveResultsToSession(): void {
    if (this.results) {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.results));
      sessionStorage.setItem(this.paramsKey, JSON.stringify(this.searchParams));
      console.log('Results and params saved to session storage');
    }
  }
}