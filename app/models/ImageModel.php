<?php
class ImageModel extends Db
{
    // Lấy tất cả images
    public function getAllImages()
    {
        $sql = parent::$connection->prepare("SELECT * FROM images");
        return parent::select($sql);
    }

    // Lấy image theo id
    public function getImageById($id)
    {
        $sql = parent::$connection->prepare('SELECT * FROM images WHERE id=?');
        $sql->bind_param('i', $id);
        return parent::select($sql)[0];
    }

    // Lấy images với phân trang
    public function getImagesWithPagination($limit, $offset)
    {
        $sql = parent::$connection->prepare('SELECT * FROM images LIMIT ? OFFSET ?');
        $sql->bind_param('ii', $limit, $offset);
        return parent::select($sql);
    }

    // Lấy tổng số lượng ảnh
    public function getTotalImages()
    {
        $sql = parent::$connection->prepare('SELECT COUNT(*) as total FROM images');
        return parent::select($sql)[0]['total'];
    }

    // Tăng views
    public function incrementClicks($id) {
        $sql = parent::$connection->prepare("UPDATE images SET clicks = clicks + 1 WHERE id = ?");
        $sql->bind_param('i', $id);
        $sql->execute();
    }
}
