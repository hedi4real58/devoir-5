import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { JeuService } from '../services/jeu.service';
import { Jeu } from '../jeux.model';

@Component({
  selector: 'app-jeux',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './jeux.component.html',
})
export class JeuxComponent implements OnInit {
  jeux: Jeu[] = [];

  constructor(private jeuservice: JeuService) {}

  ngOnInit() {
    this.chargerJeux();
  }

  chargerJeux() {
    this.jeuservice.listeJeu().subscribe(jeux => {
      console.log(jeux);
      this.jeux = jeux;
    });
  }

  supprimerJeu(p: Jeu) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.jeuservice.supprimerJeu(p.idjeu).subscribe(() => {
        console.log("jeu supprimé");
        this.chargerJeux();
      });
  }
}
