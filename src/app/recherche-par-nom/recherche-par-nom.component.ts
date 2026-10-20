import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JeuService } from '../services/jeu.service';
import { Jeu } from '../jeux.model';

@Component({
  selector: 'app-recherche-par-nom',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recherche-par-nom.component.html',
  styles: ``
})
export class RechercheParNomComponent implements OnInit {

  nomjeu!: string;
  jeux: Jeu[] = [];

  constructor(private jeuservice: JeuService) {}

  ngOnInit(): void {
    this.jeuservice.listeJeu().subscribe(jeux => {
      console.log(jeux);
      this.jeux = jeux;
    });
  }

  rechercherjeux() {
    if (this.nomjeu)
      this.jeuservice.rechercherParNom(this.nomjeu).subscribe((jeux) => {
        console.log(jeux);
        this.jeux = jeux;
      });
    else
      this.jeuservice.listeJeu().subscribe((jeux) => {
        console.log(jeux);
        this.jeux = jeux;
      });
  }
}
