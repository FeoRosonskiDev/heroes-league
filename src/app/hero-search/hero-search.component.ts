import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>
  private searchTerms = new Subject<string>()

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms
      .pipe(
        debounceTime(300), // esperamos 300ms para considerar el nuevo termino
        distinctUntilChanged(), // ignora el termino si es igual al anterior
        switchMap((term: string) => this.heroService.searchHeroes(term))
      )
  }

  search(term: string): void{
    this.searchTerms.next(term)
  }

}
