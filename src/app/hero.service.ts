import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes' // URL para api web

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // simulando que traigo la data de un servidor remoto
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('Heroes Cargados')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }

  // WTF cuando paso esto :thinking:
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`

    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`Cargado heroe con id = ${id}`)),
        catchError(this.handleError<Hero>(`getHero id =${id}`))
      )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Actualizado el heroe con id = ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`Heroe agregado con id = ${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      )
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id
    const url = `${this.heroesUrl}/${id}`

    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Elinado heroe con id = ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) { return of([]) }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(_ => this.log(`Encontrado heroes coincidentes con "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

  private log(message: string) {
    this.messageService.add(`Servicio de Heroes: ${message}`)
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      this.log(`${operation} falló: ${error.message}`)
      return of(result as T)
    }
  }
}
