<?php

if (isset($_GET["e"]) && isset($_GET["g"]) && isset($_GET["l"]) && isset($_GET["r"]) && isset($_GET["z"])) {
    $e = $_GET["e"];
    $g = $_GET["g"];
    $l = $_GET["l"];
    $r = $_GET["r"];
    $z = $_GET["z"];

    exec("cd moteur; ./moteur.sh $e $g $l $r $z");
    
    $handle = @fopen("moteur/moteur.sol", "r");
    $result = "";
    $reading_sol = false;

    if ($handle) {
        while (($buffer = fgets($handle, 4096)) !== false) {
            $zone = explode(' ', $buffer);

            if (count($zone) == 1) {
                if ($reading_sol) { // fermeture de la solution
                    $result .= "}";
                    $reading_sol = false;
                } else {
                    $result .= "]"; // fermeture des solutions
                }
            } else {
                if (!$reading_sol) {
                    if (strcmp($result, "") == 0) { // ouverture des solutions
                        $result = "[{";
                    } else { // ouverture de la solution
                        $result .= ",{";
                    }
                    $reading_sol = true;
                    $result .= "\"zone$zone[0]_\" : $zone[1]";
                } else {
                    $result .= ",\"zone$zone[0]_\" : $zone[1]";
                }
            }
        }
        if (!feof($handle)) {
            echo "Erreur: fgets() a échoué\n";
        }
        fclose($handle);
    }

    echo $result;

    // cat /var/log/apache2/error.log
} else {
    echo "Donner le nombre d'éléphants, de girafes, de lions, de rhinocéros et de zebres :";
    echo "<pre>";
    echo "controleur.php?e=1&g=1&l=1&r=1&z=1<br>";
    echo "</pre>";
}

?>
