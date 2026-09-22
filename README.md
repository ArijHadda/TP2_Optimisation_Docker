# TP2_Optimisation_Docker
TP du cours Intégration et déploiement continus (M2)

## Changement V1:
Docker suppression de COPY node_modules ./node_modules car on a la ligne RUN npm install qui va le regénéré

## Changement V2:
Ordoner les ligne du moins changable au plus changable + une separation dans la copie des fichiers package et server.js pour ne pas avoir a recopier les fichier package à chaque changement

de 

WORKDIR /app
COPY . /app
RUN npm install

à

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

## Changement V3:(dépendance fantôme)

On retir la ligne RUN apt-get update && apt-get install -y build-essential ca-certificates locales && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
car le server.js , n'utilise que express, fs, path (modules Node natifs), qui n'utilise pas ces dépendances
+ le changement de l'image node: j'ai utiliser "FROM node:20-alpine" car c'est l'image la plus minimal elle fournie que le nécessaire.

## Changement V4:

suppression de RUN npm run build car le build de package.json ne sert pas a grand chose

## Changement V5:

mongodb retiré de package.json (dépendance inutilisée)
npm install --omit=dev (exclut nodemon ( c'est un outil de développement légitime, utile quand on code en local avec le script npm run dev)

## Changement V6:
L'application n'écoute que sur un seul port (process.env.PORT || 3000, défini dans server.js). Le Dockerfile déclarait à tort trois ports (3000 4000 5000) Correction : EXPOSE 3000 uniquement.


## Tableau de comparaison des versions:
IMAGE  | Modification apportée | DISK USAGE | CONTENT SIZE
V0 | baseline | 1.89GB | 476MB 
V1 | Suppression COPY node_modules | 1.89GB | 475MB
V2 | Ordoner les lignes et séparation des fichiers a copier | 1.89GB | 475MB 
V3 | dépendance fantôme + FROM node:20-alpine| 222MB | 54MB
V4 | suppression de RUN npm run build| 222MB | 54MB
V5 | retiré "mongodb":"^6.19.0" package et retiré le devDependancies de l'instalation | 203MB  | 50MB
V6 | suppression des port inutile | 203MB  | 50MB

