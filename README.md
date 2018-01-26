# SafariCache-Cache
Projet Transfert de Technologies Émergentes - M2

## Utilisation

Les problèmes à une solution sont générés dans le fichier `moteur/problemes.json`. Les solutions de ces problèmes sont dans le fichier `moteur/solutions.json`. Si ces fichiers ne sont pas présents, lancer le générateur de problèmes avec la commande suivante (environ 10 minutes d'exécution) :

    ./moteur/generator.sh

Lancer l'interface en ouvrant le fichier `index.html`.

### Ancienne version :

Copier dans `moteur/minizinc` les fichiers du langage de modélisation de contarintes _MiniZinc_ téléchargeable à l'adresse suivante :
[MiniZincIDE-2.1.6-bundle-linux-x86_64](https://github.com/MiniZinc/MiniZincIDE/releases/download/2.1.6/MiniZincIDE-2.1.6-bundle-linux-x86_64.tgz)

Installer _MiniZinc_ :
    sudo apt-get install minizinc

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

