<?php

declare(strict_types=1);

namespace App\Services\ControllerLogic;

use App\Form\{ChangeMenuItemType, JSONMenuTreeType, MenuItemType};
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\{Response, Request};
use Twig\Environment;

/**
 * Logic for @Route("/", name="main")
 */
class MainLogic
{
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
   * @param Environment          $twig
   * @param FormFactoryInterface $formFactory
   */
  public function __construct(
      Environment $twig,
      FormFactoryInterface $formFactory
  )
  {
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
    /**
     * Kod tymczasowy. Wyświetlanie drzewa menu na podstawie poniższego stringa
     */
    $jsonMenusTree = '{"Menu":{},"Menu 2":{},"Menu 3":{"Menu 4":{"Menu 6":{},"Menu 7":{},"Menu 8":{"Menu 9":{},"Menu 10":{},"Menu 11":{}}},"Menu 5":{}}}';
    $decoded = json_decode($jsonMenusTree, true);

    $createMenuItemForm = $this->formFactory->create(MenuItemType::class);
    $jsonMenuTreeForm = $this->formFactory->create(JSONMenuTreeType::class);
    $changeMenuItemForm = $this->formFactory->create(ChangeMenuItemType::class);
    $content = $this->twig->render('index.html.twig', [
        'createForm' => $createMenuItemForm->createView(),
        'jsonForm' => $jsonMenuTreeForm->createView(),
        'changeForm' => $changeMenuItemForm->createView(),
        'jsonMenusTree' => $decoded,
    ]);
    
    return new Response($content);
  }
}
/*............................................................................*/