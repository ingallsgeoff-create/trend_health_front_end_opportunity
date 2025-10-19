import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';


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

  searchTrigger: boolean = false;
  formValid: boolean | null = null;
  error: string | null = null;
  loader: boolean = false;
  results$: Observable<any[]> = of([]);

  private apiUrl = 'http://localhost:5001/search';
  private storageKey = 'searchResults';
  private paramsKey = 'searchParams';

  constructor(
    private http: HttpClient,
    private meta: Meta,
    private title: Title,
    public shared: SharedService
  ) { }

  ngOnInit() {
    const storedResults = sessionStorage.getItem(this.storageKey);
    const storedParams = sessionStorage.getItem(this.paramsKey);

    if (storedResults && storedParams) {
      try {
        this.results$ = of(JSON.parse(storedResults));
        this.searchParams = JSON.parse(storedParams);
      } catch (e) {
        console.error('Failed to parse stored session data:', e);
        this.results$ = of([]); // return an empty array to keep template happy
        this.searchParams = { term: '', color: 'blue' };
      }
    } else {
      this.results$ = of([]); // return an empty array to keep template happy
      this.searchParams = { term: '', color: 'blue' };
    }

    this.title.setTitle('Person Search | Frontend Candidate');

    this.meta.updateTag({
      name: 'description',
      content: 'Search and explore user profiles, filter by favorite color or keyword, and instantly discover the most popular quotes in our collection.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'search profiles, character search, favorite color filter, keyword search, user discovery, color-based search, user explorer'
    });
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
    this.error = null;
    this.searchTrigger = true;
    this.loader = true;

    this.results$ = this.getSearchResults(this.searchParams).pipe(
      map((data) => {
        this.loader = false;
        const matches = Array.isArray(data.matches) ? data.matches : [];
        sessionStorage.setItem(this.storageKey, JSON.stringify(matches));
        sessionStorage.setItem(this.paramsKey, JSON.stringify(this.searchParams));
        this.searchTrigger = true;
        return matches;
      }),
      catchError((err) => {
        this.loader = false;
        this.searchTrigger = true;
        this.error = err.message || 'Search failed';
        return of([]); // return an empty array to keep template happy
      })
    );
  }
}