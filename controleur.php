
<?php

if (isset($_GET["e"]) && isset($_GET["g"]) && isset($_GET["l"]) && isset($_GET["r"]) && isset($_GET["z"])) {
    $e = $_GET["e"];
    $g = $_GET["g"];
    $l = $_GET["l"];
    $r = $_GET["r"];
    $z = $_GET["z"];

    $a = exec("cd moteur; ./moteur.sh $e $g $l $r $z");
    echo $a;

    // echo exec("cat moteur/moteur.sol");
}

?>
