# TP2_Optimisation_Docker
TP du cours Intégration et déploiement continus (M2)

## Changement V1:
docker suppression de COPY node_modules ./node_modules car on a la ligne RUN npm install qui va le regénéré



## Tableau de comparaison des versions:
IMAGE  | Modification apportée | DISK USAGE | CONTENT SIZE
V0 | baseline | 1.89GB | 476MB 
V1 | Suppression COPY node_modules | 1.89GB | 475MB
V0 | baseline | |
