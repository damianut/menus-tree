<?php

namespace App\Services\ControllerLogic;

use App\Form\{ChangeMenuItemType, MenuItemType};
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
    $createMenuItemForm = $this->formFactory->create(MenuItemType::class);
    $changeMenuItemForm = $this->formFactory->create(ChangeMenuItemType::class);
    $content = $this->twig->render('index.html.twig', [
        'createForm' => $createMenuItemForm->createView(),
        'changeForm' => $changeMenuItemForm->createView(),
    ]);
    
    return new Response($content);
  }
}
/*............................................................................*/