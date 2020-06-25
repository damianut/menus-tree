<?php

declare(strict_types=1);

namespace App\Services\DatabaseActions;

use Doctrine\ORM\EntityManagerInterface;

/**
 * Taking actions on database whose name is given in .env.local file under
 * DATABASE_URL variable.
 */
class DatabaseActions
{
  /**
   * Just Entity Manager.
   * 
   * @var EntityManagerInterface
   */
  private $entityManager;

  /**
   * @param EntityManagerInterface $entityManager
   */
  public function __construct(
      EntityManagerInterface $entityManager
  )
  {
    $this->entityManager = $entityManager;
  }

  /**
   * Get menu tree as string by UUID.
   *
   * @param  string      uuid       Uuid from URL's query
   *
   * @return string|null menuTree 
   */
  public function getMenuTree(string $uuid): ?string
  {
    do {
      $conn = $this->entityManager->getConnection();
      $sql = 'SELECT * FROM trees WHERE uuid = "'.$uuid.'";';
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll();
      if (0 == count($result)) {
        $menuTree = null;
        break;
      }
      $menuTree = $result[0]['tree'];
    } while (false);
    
    return $menuTree;
  }

  /**
   * Set menu tree as string and player UUID in database.
   *
   * @param  string uuid         UUID attached to menu tree
   * @param  string jsonMenuTree Menu tree in JSON format
   *
   * @return bool                Result of setting
   */
  public function setMenuTree(string $uuid, string $jsonMenuTree): bool
  {
    $sql = "INSERT INTO `trees` (`id`, `uuid`, `tree`) VALUES (NULL, '".
        $uuid."', '".$jsonMenuTree."');";
    $conn = $this->entityManager->getConnection();
    $stmt = $conn->prepare($sql);

    return $stmt->execute();
  }

  /**
   * Update menu tree
   *
   * @param  string uuid         UUID attached to menu tree
   * @param  string jsonMenuTree Menu tree in JSON format
   *
   * @return bool                Result of setting
   */
  public function updateMenuTree(string $uuid, string $jsonMenuTree): bool
  {
    $sql = "UPDATE `trees` SET `tree` = '".
        $jsonMenuTree."' WHERE `trees`.`uuid` = '".$uuid."';";
    $conn = $this->entityManager->getConnection();
    $stmt = $conn->prepare($sql);

    return $stmt->execute();
  }
}
/*............................................................................*/