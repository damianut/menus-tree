<?php

declare(strict_types=1);

namespace App\Services\ControllerLogic;

use App\Form\{ChangeMenuItemType, JSONMenuTreeType, MenuItemType};
use App\Services\DatabaseActions\DatabaseActions;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\{Response, Request};
use Twig\Environment;

/**
 * Logic for @Route("/", name="main")
 */
class MainLogic
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
   * Service for forms creating
   * 
   * @var FormFactoryInterface
   */
  private $formFactory;
   
  /**
   * @param DatabaseActions      $databaseActions
   * @param Environment          $twig
   * @param FormFactoryInterface $formFactory
   */
  public function __construct(
      DatabaseActions $databaseActions,
      Environment $twig,
      FormFactoryInterface $formFactory
  )
  {
    $this->databaseActions = $databaseActions;
    $this->twig = $twig;
    $this->formFactory = $formFactory;
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
    $id = $request->query->get('id');
    //Check that this $id is UUID (w projekcie escape-from może o tym być)
    $menusTree = $this->databaseActions->getMenuTree($id);

    $createMenuItemForm = $this->formFactory->create(MenuItemType::class);
    $jsonMenuTreeForm = $this->formFactory->create(JSONMenuTreeType::class);
    $changeMenuItemForm = $this->formFactory->create(ChangeMenuItemType::class);
    $content = $this->twig->render('index.html.twig', [
        'createForm' => $createMenuItemForm->createView(),
        'jsonForm' => $jsonMenuTreeForm->createView(),
        'changeForm' => $changeMenuItemForm->createView(),
        'jsonMenusTree' => json_decode($menusTree, true),
    ]);
    
    return new Response($content);
  }
}
/*............................................................................*/