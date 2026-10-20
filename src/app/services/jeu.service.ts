import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jeu } from '../jeux.model';
import { Genre } from '../model/genre.model';
import { GenreWrapper } from '../model/Genrewrapped';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const CLE_STOCKAGE = 'jeux-locaux';

@Injectable({
  providedIn: 'root',
})
export class JeuService {
  jeux!: Jeu[];
  jeu!: Jeu;
  genres!: Genre[];

  // 4 genres proposés par défaut (utilisés si le serveur n'en renvoie aucun)
  genresParDefaut: Genre[] = [
    { idGen: 1, nomGen: 'Action' },
    { idGen: 2, nomGen: 'Aventure' },
    { idGen: 3, nomGen: 'Sport' },
    { idGen: 4, nomGen: 'Stratégie' },
  ];

  // 3 jeux affichés par défaut sur la page d'accueil
  private jeuxParDefaut(): Jeu[] {
    return [
      { idjeu: 1, nomjeu: 'Battlefield 5', prixjeu: 59.99, dateCreation: new Date('2018-11-20'), genre: this.genresParDefaut[0] },
      { idjeu: 2, nomjeu: 'Fall Guys', prixjeu: 19.99, dateCreation: new Date('2020-08-04'), genre: this.genresParDefaut[1] },
      { idjeu: 3, nomjeu: 'Forza Horizon 5', prixjeu: 59.99, dateCreation: new Date('2021-11-09'), genre: this.genresParDefaut[2] },
    ];
  }

  apiURL: string = 'http://localhost:8080/jeux/api';
  apiURLGen: string = 'http://localhost:8080/jeux/gen';

  // null = pas encore testé, true = mode local (sans serveur), false = serveur Spring Boot utilisé
  private modeLocal: boolean | null = null;
  private jeuxLocaux: Jeu[] = this.chargerLocal();

  constructor(private http: HttpClient) {}

  /* ---------- Stockage local (utilisé seulement si le serveur est indisponible ou vide) ---------- */

  private chargerLocal(): Jeu[] {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE);
      if (brut) {
        const liste = JSON.parse(brut);
        if (Array.isArray(liste)) return liste;
      }
    } catch { /* ignore */ }
    return this.jeuxParDefaut();
  }

  private sauverLocal(): void {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(this.jeuxLocaux));
    } catch { /* ignore */ }
  }

  // Détecte une seule fois si le serveur répond avec des données
  private estLocal(): Observable<boolean> {
    if (this.modeLocal !== null) return of(this.modeLocal);
    return this.http.get<Jeu[]>(this.apiURL).pipe(
      map(liste => {
        this.modeLocal = !(Array.isArray(liste) && liste.length > 0);
        return this.modeLocal;
      }),
      catchError(() => {
        this.modeLocal = true;
        return of(true);
      })
    );
  }

  /* ---------- Jeux ---------- */

  listeJeu(): Observable<Jeu[]> {
    return this.estLocal().pipe(
      switchMap(local => local
        ? of([...this.jeuxLocaux])
        : this.http.get<Jeu[]>(this.apiURL))
    );
  }

  addJeu(jeu: Jeu): Observable<Jeu> {
    return this.estLocal().pipe(
      switchMap(local => {
        if (!local) return this.http.post<Jeu>(this.apiURL, jeu, httpOptions);
        const nouveau: Jeu = { ...jeu };
        nouveau.idjeu = Number(nouveau.idjeu);
        if (!nouveau.idjeu || this.jeuxLocaux.some(j => j.idjeu == nouveau.idjeu)) {
          nouveau.idjeu = Math.max(0, ...this.jeuxLocaux.map(j => Number(j.idjeu))) + 1;
        }
        this.jeuxLocaux.push(nouveau);
        this.sauverLocal();
        return of(nouveau);
      })
    );
  }

  supprimerJeu(id: number): Observable<any> {
    return this.estLocal().pipe(
      switchMap(local => {
        if (!local) return this.http.delete(`${this.apiURL}/${id}`, httpOptions);
        this.jeuxLocaux = this.jeuxLocaux.filter(j => j.idjeu != id);
        this.sauverLocal();
        return of(null);
      })
    );
  }

  consulterJeu(id: number): Observable<Jeu> {
    return this.estLocal().pipe(
      switchMap(local => local
        ? of({ ...this.jeuxLocaux.find(j => j.idjeu == id)! })
        : this.http.get<Jeu>(`${this.apiURL}/${id}`))
    );
  }

  updateJeu(jeu: Jeu): Observable<Jeu> {
    return this.estLocal().pipe(
      switchMap(local => {
        if (!local) return this.http.put<Jeu>(this.apiURL, jeu, httpOptions);
        this.jeuxLocaux = this.jeuxLocaux.map(j => j.idjeu == jeu.idjeu ? { ...jeu } : j);
        this.sauverLocal();
        return of(jeu);
      })
    );
  }

  /* ---------- Genres ---------- */

  // Accepte les deux formats : { _embedded: { genres: [...] } } ou un tableau simple [...]
  // Si le serveur ne renvoie rien (ou est en erreur), on propose les 4 genres par défaut.
  listeGenre(): Observable<GenreWrapper> {
    const defaut: GenreWrapper = { _embedded: { genres: this.genresParDefaut } };
    return this.estLocal().pipe(
      switchMap(local => local
        ? of(defaut)
        : this.http.get<any>(this.apiURLGen).pipe(
            map(res => {
              const wrapped: GenreWrapper = Array.isArray(res) ? { _embedded: { genres: res } } : res;
              const genres = wrapped?._embedded?.genres;
              return genres && genres.length > 0 ? wrapped : defaut;
            }),
            catchError(() => of(defaut))
          ))
    );
  }

  consulterGenre(id: number): Genre {
    return this.genres.find((gen) => gen.idGen == id)!;
  }

  /* ---------- Recherches ---------- */

  rechercheParGenre(idGen: number): Observable<Jeu[]> {
    return this.estLocal().pipe(
      switchMap(local => local
        ? of(this.jeuxLocaux.filter(j => j.genre?.idGen == idGen))
        : this.http.get<Jeu[]>(`${this.apiURL}/jeuxgenre/${idGen}`))
    );
  }

  rechercherParNom(nom: string): Observable<Jeu[]> {
    return this.estLocal().pipe(
      switchMap(local => local
        ? of(this.jeuxLocaux.filter(j => j.nomjeu.toLowerCase().includes(nom.toLowerCase())))
        : this.http.get<Jeu[]>(`${this.apiURL}/jeuxByName/${nom}`))
    );
  }
}
