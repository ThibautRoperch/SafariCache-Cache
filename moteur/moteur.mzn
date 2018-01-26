include "alldifferent.mzn";

% animaux passes en parametres
int: e;
int: g;
int: l;
int: r;
int: z;

% somme des animaux sur le plateau non caches par une zone
var 0..5: somme_elephant;
var 0..6: somme_gazelle;
var 0..6: somme_lion;
var 0..5: somme_rhinoceros;
var 0..5: somme_zebre;

% liste des animaux
enum animaux = {vide, elephant, gazelle, lion, rhinoceros, zebre};

% plateau de jeu
array[1..4,1..9] of animaux: zones = [|elephant, vide, lion, zebre, gazelle, zebre, rhinoceros, lion, elephant
                                      |gazelle, vide, lion, vide, zebre, elephant, lion, rhinoceros, gazelle
                                      |rhinoceros, elephant, zebre, gazelle, vide, gazelle, lion, vide, rhinoceros
                                      |vide, vide, vide, vide, rhinoceros, lion, gazelle, elephant, zebre|];

% zone sur laquelle sont places les formes
array[1..4] of var 1..4: zone_forme;

% rotation des formes
array[1..4] of var 1..4: rotation_forme;

% liste des formes avec leur 4 rotations
array[1..4,1..4,1..9] of var 0..1: formes = array3d(1..4,1..4,1..9, [0, 1, 0, 0, 0, 0, 0, 1, 0,
                                  0, 0, 0, 1, 0, 1, 0, 0, 0,
                                  0, 1, 0, 0, 0, 0, 0, 1, 0,
                                  0, 0, 0, 1, 0, 1, 0, 0, 0,
                                  
                                  0, 1, 0, 0, 1, 0, 0, 0, 0,
                                  0, 0, 0, 0, 1, 1, 0, 0, 0,
                                  0, 0, 0, 0, 1, 0, 0, 1, 0,
                                  0, 0, 0, 1, 1, 0, 0, 0, 0,
                                  
                                  0, 0, 1, 0, 0, 0, 0, 1, 0,
                                  0, 0, 0, 1, 0, 0, 0, 0, 1,
                                  0, 1, 0, 0, 0, 0, 1, 0, 0,
                                  1, 0, 0, 0, 0, 1, 0, 0, 0,
                                  
                                  1, 1, 0, 0, 0, 0, 0, 0, 1,
                                  0, 0, 1, 0, 0, 1, 1, 0, 0,                                 
                                  1, 0, 0, 0, 0, 0, 0, 1, 1,
                                  0, 0, 1, 1, 0, 0, 1, 0, 0]);

% contrainte : la forme 1 (H) a deux rotations identiques (1-3 et 2-4), on n'en garde que 2
constraint rotation_forme[1] < 3;

% contrainte : toutes les formes sont sur des zones differentes
constraint alldifferent([zone_forme[1], zone_forme[2], zone_forme[3], zone_forme[4]]);

% contrainte : la somme de chaque animal est calcule en fonction de si la zone ne cache pas la case et la case contient l'animal en question
constraint somme_elephant = (sum(i in 1..4, j in 1..9) (if formes[i,rotation_forme[i],j] = 1 /\ zones[zone_forme[i],j] = elephant then true else false endif));
constraint somme_gazelle = (sum(i in 1..4, j in 1..9) (if formes[i,rotation_forme[i],j] = 1 /\ zones[zone_forme[i],j] = gazelle then true else false endif));
constraint somme_lion = (sum(i in 1..4, j in 1..9) (if formes[i,rotation_forme[i],j] = 1 /\ zones[zone_forme[i],j] = lion then true else false endif));
constraint somme_rhinoceros = (sum(i in 1..4, j in 1..9) (if formes[i,rotation_forme[i],j] = 1 /\ zones[zone_forme[i],j] = rhinoceros then true else false endif));
constraint somme_zebre = (sum(i in 1..4, j in 1..9) (if formes[i,rotation_forme[i],j] = 1 /\ zones[zone_forme[i],j] = zebre then true else false endif));

% contrainte : la somme de chaque animal est egal aux nombres d'animaux passes en parametres
constraint somme_elephant = e;
constraint somme_gazelle = g;
constraint somme_lion = l;
constraint somme_rhinoceros = r;
constraint somme_zebre = z;

% satisfait les contraintes
solve satisfy;

% affichage : zone_de_la_forme_x rotation_de_la_forme_x pour x allant de 1 à 4
output [show(zone_forme[1])," ",show(rotation_forme[1]),"\n",
        show(zone_forme[2])," ",show(rotation_forme[2]),"\n",
        show(zone_forme[3])," ",show(rotation_forme[3]),"\n",
        show(zone_forme[4])," ",show(rotation_forme[4]),"\n"];
