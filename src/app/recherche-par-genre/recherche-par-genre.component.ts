import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { JeuService } from '../services/jeu.service';
import { Genre } from '../model/genre.model';
import { Jeu } from '../jeux.model';

@Component({
  selector: 'app-recherche-par-categorie',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './recherche-par-genre.component.html',
  styles: ``
})
export class RechercheParCategorieComponent implements OnInit {

  jeux: Jeu[] = [];
  IdGen: number = 0; // 0 = tous les genres
  genres: Genre[] = [];

  constructor(private jeuservice: JeuService) {}

  ngOnInit(): void {
    this.jeuservice.listeGenre().subscribe(gens => {
      this.genres = gens._embedded.genres;
      console.log(gens);
    });
    this.chargerTous();
  }

  chargerTous() {
    this.jeuservice.listeJeu().subscribe(jeux => {
      this.jeux = jeux;
    });
  }

  onChange() {
    if (Number(this.IdGen) === 0) {
      this.chargerTous(); // "Tous les genres"
    } else {
      this.jeuservice.rechercheParGenre(this.IdGen).subscribe(jeux => {
        this.jeux = jeux;
      });
    }
  }
}
