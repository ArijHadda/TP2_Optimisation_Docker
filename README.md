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

## Chngement V3:(dépendance fantôme)

On retir la ligne RUN apt-get update && apt-get install -y build-essential ca-certificates locales && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
car le server.js , n'utilise que express, fs, path (modules Node natifs), qui n'utilise pas ces dépendances
+ le changement de l'image node: j'ai utiliser "FROM node:20-alpine" car c'est l'image la plus minimal elle fournie que le nécessaire.


## Tableau de comparaison des versions:
IMAGE  | Modification apportée | DISK USAGE | CONTENT SIZE
V0 | baseline | 1.89GB | 476MB 
V1 | Suppression COPY node_modules | 1.89GB | 475MB
V2 | Ordoner les lignes et séparation des fichiers a copier | 1.89GB | 475MB 
V3 | dépendance fantôme + FROM node:20-alpine| 222MB | 54MB
V0 | baseline | |
