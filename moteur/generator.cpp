#include <iostream>
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <cstdlib>
#include <unistd.h>
#include <math.h>
#include <vector>

using namespace std;

/** Structure representant une solution **/
typedef struct solution {
	int e;
	int g;
	int l;
	int r;
	int z;
} solution;

int main(int argc, char** argv) {
	/** Vecteur des problemes trouves **/
	vector<solution*> resultats;

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
						
						if (lecture.is_open()) {
							string ligne;
							while (getline(lecture, ligne)) {
								++nombre_de_lignes;
							}
							
							/** Si le nombre de lignes est entre 1 et 6, il n'y a qu'une seule solution **/
							if (nombre_de_lignes > 1 && nombre_de_lignes <= 6) {
								solution* s = new solution;
								s->e = e;
								s->g = g;
								s->l = l;
								s->r = r;
								s->z = z;
								resultats.push_back(s);
							}
						}
						lecture.close();
					}
				}
			}
		}
	}
	
	/** On ecrit le fichier de problemes au format json **/
	ofstream ecriture("problemes.json");
	ecriture << "[" << endl;
	for (unsigned int i = 0; i < resultats.size(); ++i) {
		solution* s = resultats[i];
		ecriture << "\t{" << endl;
		ecriture << "\t\t \"elephant\": " << s->e << "," << endl;
		ecriture << "\t\t \"gazelle\": " << s->g << "," << endl;
		ecriture << "\t\t \"lion\": " << s->l << "," << endl;
		ecriture << "\t\t \"rhinoceros\": " << s->r << "," << endl;
		ecriture << "\t\t \"zebre\": " << s->z << "" << endl;
		ecriture << "\t}," << endl;
	}
	ecriture << "]" << endl;
	ecriture.close();
	
    return EXIT_SUCCESS;
}
