<?php

namespace App\Controller;

use App\Services\ControllerLogic\MainLogic;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class Controller extends AbstractController
{
  /**
   * @Route("/", name="main")
   */
  public function index(MainLogic $logic, Request $request)
  {
    return $logic->response($request);
  }

  /**
   * @Route("/save", name="save")
   */
  public function save(Request $request)
  {
    $jsonMenuTree = $request->request->get('json_menu_tree')['json_menu_tree'];
    dump($jsonMenuTree);
    exit;
    $sql = '';
    $conn = $this->getEntityManager()->getConnection();
    $conn->execute($sql);

    return "<p>sda</p>";
  }
}
/*............................................................................*/