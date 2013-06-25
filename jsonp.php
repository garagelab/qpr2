<?php

$url = $_GET['url'];
$callback = $_GET['callback'];

$body =  file_get_contents($url);

header('Content-Type: application/json; charset=utf-8');
print $callback .'({"data":"'. rawurlencode($body) .'"});';

?>

