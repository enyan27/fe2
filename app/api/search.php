<?php
require_once "../../config/database.php";
spl_autoload_register(function ($className) {
    require "../models/$className.php";
});

$imageModel = new ImageModel();
$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';

if ($keyword) {
    $keyword = "%$keyword%";
    $imageList = $imageModel->searchImagesByName($keyword);
} else {
    $imageList = [];
}

$response = [
    'images' => $imageList
];

header('Content-Type: application/json');
echo json_encode($response);
