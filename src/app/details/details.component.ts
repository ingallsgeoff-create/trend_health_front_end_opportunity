import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';

interface DetailResponse {
  id: number;
  name: string;
  favorite_color: string;
  quotes: { [likes: string]: string[] };
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {

  detail: DetailResponse | null = null;
  error: string | null = null;
  loader: boolean = false;
  private apiUrl = 'http://localhost:5001/details/';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public shared: SharedService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchDetails(id);
    }
  }

  fetchDetails(id: string): void {
    this.loader = true;
    this.http.get<DetailResponse>(`${this.apiUrl}${id}`).subscribe({
      next: (data) => {
        console.log('Details loaded:', data);
        this.detail = data;
        this.error = null;
        this.loader = false;
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.error = err;
        this.loader = false;
      }
    });
  }

  getSortedQuotes(): { likes: number; quote: string }[] {
    if (!this.detail?.quotes) return [];

    // Flatten the structure
    const quotesArray: { likes: number; quote: string }[] = [];

    for (const [likes, quotes] of Object.entries(this.detail.quotes)) {
      if (Array.isArray(quotes)) {
        quotes.forEach(q => quotesArray.push({ likes: Number(likes), quote: q }));
      }
    }

    // Sort by likes DESC, then quote alphabetically ASC
    quotesArray.sort((a, b) => {
      if (b.likes !== a.likes) return b.likes - a.likes;
      return a.quote.localeCompare(b.quote);
    });

    return quotesArray;
  }
}