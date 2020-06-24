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
   * @Route("/save", name="save", methods={"POST"})
   */
  public function save(Request $request)
  {
    dump($request);
    exit;
    return "<p>dgd</p>";
  }
}
/*............................................................................*/