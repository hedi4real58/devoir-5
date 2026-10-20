import { Genre } from "./model/genre.model";

export class Jeu {
    idjeu!: number;
    nomjeu!: string;
    prixjeu!: number;
    dateCreation!: Date;
    genre?: Genre;
}
