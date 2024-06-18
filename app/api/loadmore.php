<?php
require_once "../../config/database.php";
spl_autoload_register(function ($className) {
    require "../models/$className.php";
});

$imageModel = new ImageModel();
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;
$imageList = $imageModel->getImagesWithPagination($limit, $offset);
$totalImages = $imageModel->getTotalImages();

$response = [
    'images' => $imageList,
    'total' => $totalImages
];

header('Content-Type: application/json');
echo json_encode($response);
