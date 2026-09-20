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

## Tableau de comparaison des versions:
IMAGE  | Modification apportée | DISK USAGE | CONTENT SIZE
V0 | baseline | 1.89GB | 476MB 
V1 | Suppression COPY node_modules | 1.89GB | 475MB
V2 | Ordoner les lignes et séparation des fichiers a copier | 1.89GB | 475MB 
V0 | baseline | |
V0 | baseline | |
