include "alldifferent.mzn";

int: e;
int: g;
int: l;
int: r;
int: z;

var 0..5: somme_elephant;
var 0..6: somme_gazelle;
var 0..6: somme_lion;
var 0..5: somme_rhinoceros;
var 0..5: somme_zebre;

enum animaux = {vide, elephant, gazelle, lion, rhinoceros, zebre};

array[1..4,1..9] of animaux: zones = [|elephant, vide, lion, zebre, gazelle, zebre, rhinoceros, lion, elephant
                                      |gazelle, vide, lion, vide, zebre, elephant, lion, rhinoceros, gazelle
                                      |rhinoceros, elephant, zebre, gazelle, vide, gazelle, lion, vide, rhinoceros
                                      |vide, vide, vide, vide, rhinoceros, lion, gazelle, elephant, zebre|];

array[1..4] of var 1..4: numero_zone;

array[1..4] of var 1..4: numero_forme;

array[1..4,1..4,1..9] of var 0..1: formes = array3d(1..4,1..4,1..9, [0, 1, 0, 0, 0, 0, 0, 1, 0,
                                  0, 0, 0, 1, 0, 1, 0, 0, 0,
                                  0, 1, 0, 0, 0, 0, 0, 1, 0,
                                  0, 0, 0, 1, 0, 1, 0, 0, 0,
                                  
                                  0, 1, 0, 0, 1, 0, 0, 0, 0,
                                  0, 0, 0, 1, 1, 0, 0, 0, 0,
                                  0, 0, 0, 0, 1, 0, 0, 1, 0,
                                  0, 0, 0, 0, 1, 1, 0, 0, 0,
                                  
                                  0, 0, 1, 0, 0, 0, 0, 1, 0,
                                  1, 0, 0, 0, 0, 1, 0, 0, 0,
                                  0, 1, 0, 0, 0, 0, 1, 0, 0,
                                  0, 0, 0, 1, 0, 0, 0, 0, 1,
                                  
                                  1, 1, 0, 0, 0, 0, 0, 0, 1,
                                  0, 0, 1, 1, 0, 0, 1, 0, 0,
                                  1, 0, 0, 0, 0, 0, 0, 1, 1,
                                  0, 0, 1, 0, 0, 1, 1, 0, 0]);

constraint alldifferent([numero_zone[1], numero_zone[2], numero_zone[3], numero_zone[4]]);

constraint somme_elephant = (sum(i in 1..4, j in 1..9) (if formes[numero_zone[i],numero_forme[i],j] = 1 /\ zones[i,j] = elephant then true else false endif));
constraint somme_gazelle = (sum(i in 1..4, j in 1..9) (if formes[numero_zone[i],numero_forme[i],j] = 1 /\ zones[i,j] = gazelle then true else false endif));
constraint somme_lion = (sum(i in 1..4, j in 1..9) (if formes[numero_zone[i],numero_forme[i],j] = 1 /\ zones[i,j] = lion then true else false endif));
constraint somme_rhinoceros = (sum(i in 1..4, j in 1..9) (if formes[numero_zone[i],numero_forme[i],j] = 1 /\ zones[i,j] = rhinoceros then true else false endif));
constraint somme_zebre = (sum(i in 1..4, j in 1..9) (if formes[numero_zone[i],numero_forme[i],j] = 1 /\ zones[i,j] = zebre then true else false endif));

constraint somme_elephant = e;
constraint somme_gazelle = g;
constraint somme_lion = l;
constraint somme_rhinoceros = r;
constraint somme_zebre = z;

solve satisfy;

output [show(numero_zone[1])," ",show(numero_forme[1]),"\n",
        show(numero_zone[2])," ",show(numero_forme[2]),"\n",
        show(numero_zone[3])," ",show(numero_forme[3]),"\n",
        show(numero_zone[4])," ",show(numero_forme[4]),"\n"];