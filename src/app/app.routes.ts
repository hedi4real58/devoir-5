import { Routes } from '@angular/router';
import { JeuxComponent } from './jeux/jeux.component';
import { AddJeuxComponent } from './add-jeux/add-jeux.component';
import { UpdateJeuComponent } from './update-jeu/update-jeu.component';
import { RechercheParCategorieComponent } from './recherche-par-genre/recherche-par-genre.component';
import { RechercheParNomComponent } from './recherche-par-nom/recherche-par-nom.component';

export const routes: Routes = [
    { path: "jeux", component: JeuxComponent },
    { path: "add-jeux", component: AddJeuxComponent },
    { path: "", redirectTo: "jeux", pathMatch: "full" },
    { path: "updateJeu/:id", component: UpdateJeuComponent },
    { path: "rechercheParGenre", component: RechercheParCategorieComponent },
    { path: "rechercheParNom", component: RechercheParNomComponent },
];
