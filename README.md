# TP2_Optimisation_Docker
TP du cours Intégration et déploiement continus (M2)

## Changement V1 :
Suppression de `COPY node_modules ./node_modules` dans le Dockerfile, car la ligne `RUN npm install` le régénère déjà.

## Changement V2 :
Ordonner les lignes du moins changeant au plus changeant, avec une séparation dans la copie des fichiers `package.json` et `server.js`, pour ne pas avoir à recopier les fichiers `package` à chaque changement.

de

WORKDIR /app
COPY . /app
RUN npm install

à

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .


## Changement V3 : (dépendance fantôme)

On retire la ligne `RUN apt-get update && apt-get install -y build-essential ca-certificates locales && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen`, car `server.js` n'utilise que `express`, `fs` et `path` (modules Node natifs), qui n'ont pas besoin de ces dépendances.
+ Changement de l'image Node : utilisation de `FROM node:20-alpine`, car c'est l'image la plus minimale, elle fournit uniquement le nécessaire.

## Changement V4 :

Suppression de `RUN npm run build`, car le script `build` du `package.json` ne fait rien d'utile.

## Changement V5 :

`mongodb` retiré de `package.json` (dépendance inutilisée).
`npm install --omit=dev` (exclut `nodemon`, un outil de développement légitime, utile quand on code en local avec le script `npm run dev`).

## Changement V6 :

L'application n'écoute que sur un seul port (`process.env.PORT || 3000`, défini dans `server.js`). Le Dockerfile déclarait à tort trois ports (`3000 4000 5000`). Correction : `EXPOSE 3000` uniquement.

## Changement V7 :

L'image était configurée en `NODE_ENV=development`, alors qu'elle est destinée à être déployée. Ce mode désactive plusieurs optimisations internes d'Express et de Node.js, ce qui impacte à la fois les performances et la sécurité en production. Correction : `NODE_ENV=production`.

## Changement V8 :

Le conteneur tournait avec l'utilisateur `root`, ce qui donne des privilèges système complets à l'application à l'intérieur du conteneur — un risque de sécurité inutile pour une simple application web. L'image `node:alpine` fournit un utilisateur non privilégié prêt à l'emploi (`node`). Correction : `USER node`, placé juste avant `CMD`, pour que toutes les opérations nécessitant des droits élevés (installation de dépendances, copie de fichiers) restent effectuées avant le changement d'utilisateur.

## Changement V9 :

Remplacement de `npm install` par `npm ci --omit=dev`.
Le Dockerfile utilisait `npm install`, une commande pensée pour le développement local : elle peut modifier `package-lock.json`, recalculer des versions, et n'est pas garantie de produire exactement le même résultat d'une exécution à l'autre. Pour un build automatisé et reproductible comme celui d'une image Docker, `npm ci` est plus adaptée : elle installe strictement les versions figées dans `package-lock.json`, sans jamais le modifier, et repart toujours d'un `node_modules` propre. Elle est aussi généralement plus rapide dans ce contexte. L'option `--omit=dev` est conservée pour continuer à exclure les dépendances de développement (`nodemon`) de l'image finale.

## Changement V10 :

Nettoyage du cache npm dans la même couche que l'installation.
`npm ci` génère un cache local des paquets téléchargés, utile uniquement pour de futures installations sur la même machine — inutile une fois l'image construite. Pour que ce nettoyage réduise réellement la taille de l'image, il doit être exécuté dans la même instruction `RUN` que l'installation (`RUN npm ci --omit=dev && npm cache clean --force`), car chaque `RUN` Docker crée une couche persistante : un nettoyage effectué dans une couche séparée ne libère pas l'espace occupé par la couche précédente.

## Tableau de comparaison des versions :

| IMAGE | Modification apportée | DISK USAGE | CONTENT SIZE |
|---|---|---|---|
| V0 | Baseline | 1.89GB | 476MB |
| V1 | Suppression de `COPY node_modules` | 1.89GB | 475MB |
| V2 | Ordonnancement des lignes et séparation des fichiers à copier | 1.89GB | 475MB |
| V3 | Dépendance fantôme retirée + `FROM node:20-alpine` | 222MB | 54MB |
| V4 | Suppression de `RUN npm run build` | 222MB | 54MB |
| V5 | Retrait de `"mongodb":"^6.19.0"` et des `devDependencies` à l'installation | 203MB | 50MB |
| V6 | Suppression des ports inutiles | 203MB | 50MB |
| V7 | `ENV NODE_ENV=production` | 203MB | 50MB |
| V8 | `USER node` | 203MB | 50MB |
| V9 | `RUN npm ci --omit=dev` | 203MB | 50MB |
| V10 | Nettoyage du cache | 199MB | 49.1MB |
