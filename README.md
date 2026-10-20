# Jeu - Gestion des jeux (Angular 19)

## Lancer
1. Ouvrir PowerShell DANS ce dossier (celui qui contient angular.json)
2. npm install
3. ng serve        (ou: npm start)
4. Ouvrir http://localhost:4200

## Backend attendu (Spring Boot, port 8080)
- GET/POST/PUT   http://localhost:8080/jeux/api
- GET/DELETE     http://localhost:8080/jeux/api/{id}
- GET            http://localhost:8080/jeux/api/jeuxgenre/{idGen}
- GET            http://localhost:8080/jeux/api/jeuxByName/{nom}
- GET            http://localhost:8080/jeux/gen   (tableau, ou { _embedded: { genres: [...] } })
Ajouter @CrossOrigin("*") sur les controllers pour eviter l'erreur CORS.
