minizinc/mzn2fzn moteur.mzn -D \ "e=$1; g=$2; l=$3; r=$4; z=$5;"
minizinc/flatzinc -a moteur.fzn | solns2out moteur.ozn > moteur.sol
