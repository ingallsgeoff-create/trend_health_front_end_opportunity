import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DetailResponse {
  id: number;
  name: string;
  favorite_color: string;
  quotes: { [likes: string]: string };
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {

  detail: DetailResponse | null = null;
  error: boolean = false;
  loader: boolean = false;
  private apiUrl = 'http://localhost:5001/details/';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
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
        this.error = false;
        this.loader = false;
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.error = true;
        this.loader = false;
      }
    });
  }


  getSortedQuotes(): [string, string][] {
    return this.detail
      ? Object.entries(this.detail.quotes).sort(
        ([aLikes], [bLikes]) => Number(bLikes) - Number(aLikes)
      )
      : [];
  }
}