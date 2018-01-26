#include <iostream>
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <cstdlib>
#include <unistd.h>
#include <math.h>
#include <vector>

using namespace std;

/** Structure representant un probleme **/
typedef struct probleme {
	int e;
	int g;
	int l;
	int r;
	int z;
} probleme;

/** Structure representant une solution **/
typedef struct solution {
	char piece1[2];
	char piece2[2];
	char piece3[2];
	char piece4[2];
} solution;

int main(int argc, char** argv) {
	/** Vecteur des problemes trouves **/
	vector<probleme*> problemes;
	/** Vecteur des solutions des problemes trouves **/
	vector<solution*> solutions;

	/** Nombre maximal des animaux **/
	int somme_elephant = 5;
	int somme_gazelle = 6;
	int somme_lion = 6;
	int somme_rhinoceros = 5;
	int somme_zebre = 5;

	/** Parcours des problemes **/
	for (int e = 0; e <= somme_elephant; ++e) {
		for (int g = 0; g <= somme_gazelle; ++g) {
			for (int l = 0; l <= somme_lion; ++l) {
				for (int r = 0; r <= somme_rhinoceros; ++r) {
					for (int z = 0; z <= somme_zebre; ++z) {
						/** On execute le script minizinc avec les animaux en parametres **/
						string s = string("./moteur.sh ") + to_string(e) + string(" ") + to_string(g) + string(" ") + to_string(l) + string(" ") + to_string(r) + string(" ") + to_string(z);
						system(s.c_str());
						
						/** On lit le fichier **/
						ifstream lecture("moteur.sol");
						int nombre_de_lignes = 0;
						solution* sol = new solution;

						if (lecture.is_open()) {
							string ligne;
							while (getline(lecture, ligne) && nombre_de_lignes < 10) {
								++nombre_de_lignes;
								switch (nombre_de_lignes) {
									case 1:
										sol->piece1[0] = ligne[0]; // Attention : les indices des pièces et des rotations sont limitées à 9
										sol->piece1[1] = ligne[2];
										break;
									case 2:
										sol->piece2[0] = ligne[0];
										sol->piece2[1] = ligne[2];
										break;
									case 3:
										sol->piece3[0] = ligne[0];
										sol->piece3[1] = ligne[2];
										break;
									case 4:
										sol->piece4[0] = ligne[0];
										sol->piece4[1] = ligne[2];
										break;
								}
							}
							
							/** Si le nombre de lignes est entre 1 et 6, il n'y a qu'un seul probleme **/
							if (nombre_de_lignes > 1 && nombre_de_lignes <= 6) {
								probleme* prob = new probleme;
								prob->e = e;
								prob->g = g;
								prob->l = l;
								prob->r = r;
								prob->z = z;
								problemes.push_back(prob);
								solutions.push_back(sol);
							}
						}
						lecture.close();
					}
				}
			}
		}
	}
	
	/** On ecrit le fichier de problemes au format json **/
	ofstream fichier_prob("problemes.json");
	fichier_prob << "[" << endl;
	for (unsigned int i = 0; i < problemes.size(); ++i) {
		probleme* prob = problemes[i];
		fichier_prob << "\t{" << endl;
		fichier_prob << "\t\t \"elephant\": " << prob->e << "," << endl;
		fichier_prob << "\t\t \"gazelle\": " << prob->g << "," << endl;
		fichier_prob << "\t\t \"lion\": " << prob->l << "," << endl;
		fichier_prob << "\t\t \"rhinoceros\": " << prob->r << "," << endl;
		fichier_prob << "\t\t \"zebre\": " << prob->z << "" << endl;
		fichier_prob << "\t}";
		if (i < problemes.size() - 1) {
			fichier_prob << ",";
		}
		fichier_prob << endl;
	}
	fichier_prob << "]" << endl;
	fichier_prob.close();
	
	/** On ecrit le fichier de solutions au format json **/
	ofstream fichier_sol("solutions.json");
	fichier_sol << "[" << endl;
	for (unsigned int i = 0; i < solutions.size(); ++i) {
		solution* sol = solutions[i];
		fichier_sol << "\t{" << endl;
		fichier_sol << "\t\t \"piece" << sol->piece1[0] << "_\": " << sol->piece1[1] << "," << endl;
		fichier_sol << "\t\t \"piece" << sol->piece2[0] << "_\": " << sol->piece2[1] << "," << endl;
		fichier_sol << "\t\t \"piece" << sol->piece3[0] << "_\": " << sol->piece3[1] << "," << endl;
		fichier_sol << "\t\t \"piece" << sol->piece4[0] << "_\": " << sol->piece4[1] << "" << endl;
		fichier_sol << "\t}";
		if (i < solutions.size() - 1) {
			fichier_sol << ",";
		}
		fichier_sol << endl;
	}
	fichier_sol << "]" << endl;
	fichier_sol.close();
	
    return EXIT_SUCCESS;
}
