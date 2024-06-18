<?php
require_once "../../config/database.php";
spl_autoload_register(function ($className) {
    require "../models/$className.php";
});

$imageModel = new ImageModel();
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$imageDetails = $imageModel->getImageById($id);

header('Content-Type: application/json');
echo json_encode($imageDetails);
