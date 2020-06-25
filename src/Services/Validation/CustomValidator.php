<?php
declare(strict_types=1);

namespace App\Services\Validation;

use Symfony\Component\Validator\Constraints as Asserts;
use Symfony\Component\Validator\{ConstraintViolationList, Validation};

/**
 * Custom validation's methods.
 */
class CustomValidator
{
  /**
   * Validator
   * 
   * @var Validation
   */
  private $validator;

  public function __construct()
  {
    $this->validator = Validation::createValidator();
  }
  
  /**
   * Check that string in argument is a valid JSON.
   * 
   * @param  string $json
   * 
   * @return bool         True if string is valid, false otherwise
   */
  public function validateJSON(string $json): bool
  {
    $violations = $this->validator->validate($json, [
        new Asserts\Json(),
    ]);
    
    return 0 === $violations->count();
  }
}
/*............................................................................*/