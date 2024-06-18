<?php
require_once "../../config/database.php";
spl_autoload_register(function ($className) {
    require "../models/$className.php";
});

$imageModel = new ImageModel();
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

if ($id > 0) {
    $imageModel->incrementLoves($id);
}