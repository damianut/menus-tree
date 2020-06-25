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
   * @param  string id       ID from URL's query
   *
   * @return string menuTree 
   */
  public function getMenuTree(?string $id): string
  {
    do {
      if (\is_null($id)) {
        $menuTree = '{}';
        break;
      }
      $conn = $this->entityManager->getConnection();
      $sql = 'SELECT * FROM trees WHERE id = "'.$id.'"';
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll();
      if (0 == count($result)) {
        $menuTree = '{}';
        break;
      }
      $menuTree = $result[0]['tree'];
    } while (false);
    
    return $menuTree;
  }

  /**
   * Set menu tree as string and player UUID in database.
   *
   * @param  string|null uuid         UUID from URL's query if exists
   * @param  string      jsonMenuTree Menu tree in JSON format
   *
   * @return string      menuTree 
   */
  public function setMenuTree(?string $uuid, string $jsonMenuTree): string
  {
    $sql = "INSERT INTO `trees` (`id`, `tree`) VALUES ('".
        $uuid."', '".$jsonMenuTree."');";
    $conn = $this->getEntityManager()->getConnection();

    return $conn->execute($sql);
  }
}
/*............................................................................*/