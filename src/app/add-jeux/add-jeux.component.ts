import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JeuService } from '../services/jeu.service';
import { Genre } from '../model/genre.model';
import { Jeu } from '../jeux.model';

@Component({
  selector: 'app-add-jeux',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './add-jeux.component.html'
})
export class AddJeuxComponent implements OnInit {

  newJeu = new Jeu();
  message!: string;
  genres: Genre[] = [];
  newidGen!: number;
  newGenre!: Genre;

  constructor(private jeuservice: JeuService,
              private router: Router) {}

  ngOnInit(): void {
    this.jeuservice.listeGenre().subscribe(gens => {
      console.log(gens);
      this.genres = gens._embedded.genres;
      if (this.genres.length > 0 && !this.newidGen) {
        this.newidGen = this.genres[0].idGen; // premier genre sélectionné par défaut
      }
    });
  }

  addJeu() {
    this.newJeu.genre = this.genres.find(gen => gen.idGen == this.newidGen)!;
    this.jeuservice.addJeu(this.newJeu).subscribe({
      next: (jeu) => {
        console.log(jeu);
        this.router.navigate(['/jeux']); // retour automatique à la page d'accueil
      },
      error: (err) => {
        console.error(err);
        this.message = "Erreur : le jeu n'a pas été ajouté (vérifiez le serveur).";
      }
    });
  }
}
