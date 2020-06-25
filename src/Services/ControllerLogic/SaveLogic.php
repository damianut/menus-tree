<?php

declare(strict_types=1);

namespace App\Services\ControllerLogic;

use App\Services\DatabaseActions\DatabaseActions;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\{RedirectResponse, Request};
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Twig\Environment;

/**
 * Logic for @Route("/save", name="save")
 */
class SaveLogic
{
  /**
   * Service for performing custom actions on database
   *
   * @var DatabaseActions
   */
  private $databaseActions;

  /**
   * Twig for template rendering
   * 
   * @var Environment
   */
  private $twig;

  /**
   * URL generator
   * 
   * @var UrlGeneratorInterface
   */
  protected $router;
   
  /**
   * @param DatabaseActions       $databaseActions
   * @param Environment           $twig
   * @param UrlGeneratorInterface $router
   */
  public function __construct(
      DatabaseActions $databaseActions,
      Environment $twig,
      UrlGeneratorInterface $router
  )
  {
    $this->databaseActions = $databaseActions;
    $this->twig = $twig;
    $this->router = $router;
  }
  
  /**
   * Prepare response for route in controller.
   * 
   * @param  Request  $request
   * 
   * @return Response 
   */
  public function response(Request $request): Response
  {
    $jsonMenuTree = $request->request->get('json_menu_tree')['json_menu_tree'];
    $id = $request->request->get('json_menu_tree')['tree_id'];
    $result = $this->databaseActions->setMenuTree($id, $jsonMenuTree);
    $url = $this->router->generate('main');
    //$decoded = json_decode($jsonMenuTree, true);
    
    //Zwraca TRUE jak się uda.

    //Uuid::uuid4()->toString();
    /**
     * Check that generated UUID is free to use
     *
     * SQL statement - check that key exists.
     */
    return new RedirectResponse($url);
  }
}
/*............................................................................*/