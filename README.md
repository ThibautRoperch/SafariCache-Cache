# SafariCache-Cache

Projet de l'UE Transfert de Technologies Émergentes - Master 2 Informatique à l'Université d'Angers

## Participants

Pierre Granier--Richard
Maxime Leblanc
Thibaut Roperch

## Règles du jeu

Le but du jeu est de couvrir, au moyen de 4 pièces prédéfinies, un certain nombre de dessins répartis sur les 4 zones du plateau. L'objectif donné par le jeu est le nombre de dessins devant être visibles.


Notre interface graphique permet de joueur à 169 défis. Les défis disponibles sont les problèmes pour lesquels il existe une et une seule solution.

La résolution d'un défi, aléatoirement donné, est chronométrée. Le meilleur score de chaque défi, en terme de temps, est sauvegardé pour la session et affiché.

⭯ permet de remettre les pièces à leur position initiale.

💡 permet de donner un indice sur les pièces actuellement placées sur le plateau, le résultat devant être interprété comme suit :
* Une pièce mal placée aura un fond rouge
* Une pièce correctement placée mais mal tournée aura un fond orange
* Une pièce correctement placée et correctement tournée aura un fond vert

Cependant, utiliser un indice ajoute 60 secondes au chronomètre.

Notre interface propose également de passer le défi actuel et de le résoudre automatiquement.

## Utilisation

Les problèmes à une solution sont générés dans le fichier `moteur/problemes.json`. Les solutions de ces problèmes sont dans le fichier `moteur/solutions.json`. Si ces fichiers ne sont pas présents, installer MiniZinc (voir section suivante) et lancer le générateur de problèmes avec la commande suivante (environ 10 minutes d'exécution) :

    ./moteur/generator.sh

Lancer l'interface en ouvrant le fichier `index.html`.

L'interface charge en amont les fichiers JSON, ainsi aucun appel au moteur MiniZinc n'est necessaire.

## Installer MiniZinc

Copier dans `moteur/minizinc` les fichiers de _MiniZinc_ téléchargeables à l'adresse suivante :
[MiniZincIDE-2.1.6-bundle-linux-x86_64](https://github.com/MiniZinc/MiniZincIDE/releases/download/2.1.6/MiniZincIDE-2.1.6-bundle-linux-x86_64.tgz)

Installer _MiniZinc_ sur la machine :
    sudo apt-get install minizinc

### Ancienne version (modèle MVC)

Installer MiniZinc

Installer un serveur apache :

    sudo apt install apache2 php libapache2-mod-php

Déplacer le dossier `SafariCache-Cache` à dans `/var/www/html` (emplacement du serveur apache par défaut).

Penser à ajouter les droits d'écriture et d'exécution pour les autres utilisateurs

Lancer lamp :

`service apache2 start` (resp. `stop`) pour allumer (resp. éteindre) le service apache2

Ouvrir l'interface graphique :
[SafariCache-Cache](http://localhost/SafariCache-Cache/)

Pour obtenir les solutions d'un problème personnélisé, se déplacer dans le dossier `moteur` et exécuter le script `moteur.sh` avec, dans cet ordre, le nombre d'éléphants, de girafes, de lions, de rhinocéros et de zèbres. La solution s'écrit dans le fichier `moteur.sol`. Exemples :

    cd moteur
    ./moteur.sh 1 2 1 3 2 // INSATISFIABLE
    cat moteur.sol
    ./moteur.sh 1 2 1 2 2 // SATISFIABLE, 4 solutions
    cat moteur.sol

L'interface charge en amont le fichier JSON contenant les problèmes à une solution. Lorsqu'un problème est chargé, la solution est obtenue via un appel AJAX auprès du controleur (`controleur.php`), qui appelle le moteur MiniZinc et récupère la solution pour l'envoyer à l'interface.
