import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Jeu } from '../jeux.model';
import { Genre } from '../model/genre.model';
import { JeuService } from '../services/jeu.service';

@Component({
  selector: 'app-update-jeu',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './update-jeu.component.html',
  styles: ``,
})
export class UpdateJeuComponent implements OnInit {
  currentJeu = new Jeu();

  genres: Genre[] = [];
  updatedidGen!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private jeuservice: JeuService
  ) {}

  ngOnInit(): void {
    this.jeuservice.listeGenre().subscribe(gens => {
      console.log(gens);
      this.genres = gens._embedded.genres;
    });
    this.jeuservice.consulterJeu(this.activatedRoute.snapshot.params['id']).subscribe(jeu => {
      this.currentJeu = jeu;
      this.updatedidGen = this.currentJeu.genre?.idGen!;
    });
  }

  updateJeu() {
    this.currentJeu.genre = this.genres.find(
      (gen) => gen.idGen == this.updatedidGen
    )!;
    this.jeuservice.updateJeu(this.currentJeu).subscribe(() => {
      this.router.navigate(['jeux']);
    });
  }
}
