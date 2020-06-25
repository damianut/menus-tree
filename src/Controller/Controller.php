<?php

namespace App\Controller;

use App\Services\ControllerLogic\{MainLogic, SaveLogic};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class Controller extends AbstractController
{
  /**
   * @Route("/", name="main")
   */
  public function main(MainLogic $logic, Request $request)
  {
    return $logic->response($request);
  }

  /**
   * @Route("/save", name="save", methods={"post"})
   */
  public function save(SaveLogic $logic, Request $request)
  {
    return $logic->response($request);
  }
}
/*............................................................................*/