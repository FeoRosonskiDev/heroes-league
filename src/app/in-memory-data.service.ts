import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  constructor() { }

  createDb() {
    const heroes = [
      { id: 11, name: 'Dr Gustoso', skill: 'Cambio de Humor' },
      { id: 12, name: 'Bomber', skill: 'Bombarda' },
      { id: 13, name: 'Dynamox', skill: 'Patada Veloz' },
      { id: 14, name: 'Turone', skill: 'Emboscada' },
      { id: 15, name: 'Lavafir', skill: 'Cadenas Ardientes' },
      { id: 16, name: 'Turono', skill: 'Canto Malevolo'}
    ]
    return {heroes}
  }

  // para asegurar que siempre haya un id
  genId(heroes: Hero[]): number
  {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11
  }
}
