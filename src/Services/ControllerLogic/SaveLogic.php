<?php

declare(strict_types=1);

namespace App\Services\ControllerLogic;

use App\Services\DatabaseActions\DatabaseActions;
use App\Services\Validation\CustomValidator;
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
   * Validating JSON
   *
   * @var CustomValidator
   */
  private $validator;

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
  private $router;
   
  /**
   * @param CustomValidator       $validator
   * @param DatabaseActions       $databaseActions
   * @param Environment           $twig
   * @param UrlGeneratorInterface $router
   */
  public function __construct(
      CustomValidator $validator,
      DatabaseActions $databaseActions,
      Environment $twig,
      UrlGeneratorInterface $router
  )
  {
    $this->validator = $validator;
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
  public function response(Request $request): RedirectResponse
  {
    do {
      $jsonMenuTree = 
          $request->request->get('json_menu_tree')['json_menu_tree'];
      $id = $request->request->get('json_menu_tree')['tree_id'];
      if ('' === $id) {
        $id = null;
      }
      if (!\is_null($id) && !Uuid::isValid($id)) {
        $url = $this->router->generate('main');
        break;
      }
      if (!\is_null($id) && !$this->validator->validateJSON($jsonMenuTree)) {
        $url = $this->router->generate('main');
        break;
      }
      /**
       * If retrievied menu tree doesn't has attached uuid, run below loop
       * until uuid is generated that isn't exists in database.
       */
      while (\is_null($id)) {
        $id = Uuid::uuid4()->toString();
        $tree = $this->databaseActions->getMenuTree($id);
        if (!\is_null($tree)) {
          $id = null;
        }
      }
      $result = $this->databaseActions->getMenuTree($id) ? 
        $this->databaseActions->updateMenuTree($id, $jsonMenuTree) :
        $this->databaseActions->setMenuTree($id, $jsonMenuTree);
      $url = $this->router->generate('main', ['id' => $id]);
    } while (false);

    return new RedirectResponse($url);
  }
}
/*............................................................................*/