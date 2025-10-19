import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortQuotes' })
export class SortQuotesPipe implements PipeTransform {
  transform(quotes: { [likes: string]: string[] }): { likes: number; quote: string }[] {
    if (!quotes) return [];
    const arr: { likes: number; quote: string }[] = [];
    for (const [likes, qs] of Object.entries(quotes)) {
      qs.forEach(q => arr.push({ likes: +likes, quote: q }));
    }
    return arr.sort((a, b) => b.likes - a.likes || a.quote.localeCompare(b.quote));
  }
}