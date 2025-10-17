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

  results: any[] | null = null;

  private apiUrl = 'http://localhost:5001/search';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.searchParams.color = '';
    this.searchParams.term = '';
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
    console.log('getSearchResults Called', this.searchParams);
    this.getSearchResults(this.searchParams).subscribe({
      next: (data) => {
        this.results = Array.isArray(data.matches) ? data.matches : [data.matches]; // Ensure consistent display
      },
      error: (err) => {
        console.error('Error:', err);
        this.results = [];
      }
    });
  }
}