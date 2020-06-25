'use strict';


//=============================================================================/
// GLOBAL VARIABLES
//=============================================================================/

//Modals IDs
var modId = '#add-menu-item-modal';
var changeRemoveModId = '#edit-remove-menu-item-modal';
//Create menu item
var plusBtnClass = 'button.add-menu-item';
var saveBtnClass = 'button.modal-saving-btn';
//Editing name
var saveNameBtnClass = 'button.modal-editing-btn';
//Deleting menu item
var deleteBtnClass = 'button.modal-removing-btn';

//Menu item class
var menuItem = '.menu-item';

//Dragged element
var dragged;

//Vars for saving menus tree as JSON.
var menusTree = {};
var inputForTree = '#json_menu_tree_json_menu_tree';
var inputForTreeId = '#json_menu_tree_tree_id';


//=============================================================================/
// EXECUTED FUNCTIONS
//=============================================================================/

window.onload = function() {
  disableMenuClosing();
  multilevelMenusNesting();
  changeClickedBtnColor();
  makeSubmenusDraggable();
  enableAddingMenuItem();
  enableChangingMenuItem();
  dragDropAllMenuItems();
  enableDroppingByPlusBtns();
  savingChanges();
}


//=============================================================================/
// DEFINITIONS OF FUNCTIONS
//
// Order of function groups in this file:
// 1. Validation
// 2. Forms
// 3. Check uniquity of new menu item name
// 4. Improving user comfort while creating menu
// 5. Styles
// 6. Allowing menu nesting
// 7. Adding menu item
// 8. Changing menu item
// 9. Drag&Drop menu items
// 10. Send information about menus tree to Symfony controller
//
//=============================================================================/

//=============================================================================/
// 1. functions: VALIDATION
//=============================================================================/

/**
 * Check that name contains only alphanumeric chars, underscore and space.
 *
 * Return true, if name is valid. False otherwise.
 *
 * @var {string} itemName Name of new menu item typed by user.
 */
function validateItemName(itemName) {
  let regex = new RegExp("[^\\w\\s]+", "m");

  return !regex.test(itemName);
}

/**
 * Add violation message to modal.
 *
 * @var {string} violationMsg Message about violation for user
 * @var {string} modalId      ID of modal
 */
function addViolationMsg(violationMsg, modalId) {
  let violationEl =
    '<h6 class="text-danger font-weight-bold violation-msg">' + violationMsg +
    '</h6>';
  $(modalId).find('.modal-body').children().last().before(violationEl);
}

/**
 * Remove violation message from modal.
 *
 * @var {string} modalId ID of modal
 */
function removeViolationMsg(modalId) {
  $(modalId).find('h6.violation-msg').remove();
}

//=============================================================================/
// 2. functions: FORMS
//=============================================================================/

/**
 * Enter text in text input in modal for changing menu item
 *
 * @var {string} txt Text to enter
 */
function enterTextForChangeRemoveModInput(txt) {
  $(changeRemoveModId).find('#change_menu_item_name').val(txt);
}

/**
 * Clear text input with menu item name.
 */
function clearChangeRemoveModInput() {
  enterTextForChangeRemoveModInput('');
}

/**
 * Enter text in text input in modal for creating menu item
 *
 * @var {string} txt Text to enter
 */
function enterTextForModInput(txt) {
  $(modId).find('#menu_item_name').val(txt);
}

/**
 * Clear text input with menu item name.
 */
function clearModInput() {
  enterTextForModInput('');
}


//=============================================================================/
// 3. functions: CHECK UNIQUITY OF NEW MENU ITEM NAME
//=============================================================================/

/**
 * Check that user provided unique name.
 *
 * @var {string} elName Name of new menu item typed by user
 */
function checkUniquity(elName) {
  let result = true;
  $('.menu-item').each(function(){
    if ($(this).html() === elName) {
      result = false;
      return;
    }
  });

  return result;
}


//=============================================================================/
// 4. functions: IMPROVING USER COMFORT WHILE CREATING MENU
//=============================================================================/

/**
 * Disable closing menu by clicking on menu.
 *
 * Stop propagation of "click" event to prevent closing menus by clicking
 * another button, than button with "+" sign.
 */
function disableMenuClosing() {
  $('.dropdown-menu').on('click', function(e) {
    e.stopPropagation();
  });
}


//=============================================================================/
// 5. functions: STYLES
//=============================================================================/

/**
 * Change color of generally selected button(s)
 *
 * @var {jQuery} selected Selected buttons by .find() jQuery method
 */
function changeClickedBtnColorGen(selected) {
  selected.on('mousedown', function() {
    $(this).css('background-color', 'rgb(40, 167, 69)');
    $(this).removeClass('text-dark');
    $(this).addClass('text-light');
  });
  selected.on('mouseup', function() {
    $(this).css('background-color', 'rgb(248, 249, 250)');
    $(this).removeClass('text-light');
    $(this).addClass('text-dark');
  });
}

/**
 * Change color of all "+" buttons while clicking.
 */
function changeClickedBtnColor() {
  changeClickedBtnColorGen($(plusBtnClass));
}


//=============================================================================/
// 6. functions: ALLOWING MENUS NESTING
//=============================================================================/

/**
 * "click" event handler that showing and hiding menus nested on all levels.
 *
 * @var {Event} e 
 */
function multilevelMenusNestingHandler(e) {
  let visibility =
      $(e.currentTarget).children('.dropdown-menu').css('display');
  if ('none' === visibility) {
    $(e.currentTarget).children('.dropdown-menu').css('display', 'block');
  } else if ('block' === visibility) {
    $(e.currentTarget).children('.dropdown-menu').css('display', 'none');
  }
}

/**
 * Attach above defined handler to '.dropdown-submenu' class
 */
function multilevelMenusNesting() {
  $('.dropdown-submenu').on('click', function(e) {
    multilevelMenusNestingHandler(e);
  });
}


//=============================================================================/
// 7. functions: ADDING MENU ITEM
//=============================================================================/

/**
 * Cloning menu item with empty submenu
 *
 * @var {string} elName Name of new menu item typed by user
 */
function cloneMenuItem(elName) {
  let menuItem = $('#empty-submenu').clone();
  menuItem.removeAttr('id');
  menuItem.removeClass('d-none');
  menuItem.children('.dropdown-item')[0].innerHTML = elName;

  return menuItem;
}

/**
 * Cloning "+" button.
 */
function clonePlusBtn() {
  let plusBtn = $('#proto-plus-btn').clone();
  plusBtn.removeAttr('id');
  plusBtn.removeClass('d-none');

  return plusBtn;
}

/**
 * Procedure which taken place when "click" event on "+" button is fired.
 *
 * By clicking "+" button user can toggle modal.
 * If modal is hidden, it will be shown and "createMenuItem" handler will be
 * attached to this "+" button. If modal closes without saving; this handler
 * will be detached.
 *
 * Else if modal is shown, modal is toggled only.
 *
 * @var {Event} e 
 */
function plusBtnsProcedure(e) {
  do {
    if ($(modId).hasClass('show')) {
      break;
    }
    $(e.currentTarget).one('createMenuItem', function(eSub1, data) {
      eSub1.stopPropagation();
      /**
       * Clone new element of menu.
       */
      let menuItem = cloneMenuItem(data.elName);
      /**
       * Make submenu draggable
       */
      dragDropMenuItem(menuItem.children().first());
      /**
       * Allow showing and hiding submenus after clicking on this element.
       */
      menuItem.on('click', function(eSubSub1) {
        multilevelMenusNestingHandler(eSubSub1);
      });
      /**
       * Allow editing and removing this menu item
       */
      menuItem.find('.menu-item').on('contextmenu', function(eSubSub2) {
        let elName = $(this).html();
        menuItemBtnChangingProcedure(eSubSub2, {'elName': elName});
      });
      /**
       * Disable closing menu by clicking on menu.
       *
       * Stop propagation of "click" event to prevent closing menus by clicking
       * another button, than button with "+" sign.
       */
      menuItem.find('.dropdown-menu').on('click', function(eSubSub3) {
        eSubSub3.stopPropagation();
      });
      /**
       * New menu contains "+" button. Below handler was attach on all buttons
       * with 'add-menu-item' class while site loading. This event handler
       * should also be attached to buttons created later.
       */
      menuItem.find(plusBtnClass).on('click', function(evtSubSub4) {
        plusBtnsProcedure(evtSubSub4);
      });
      /**
       * If only one "+" button exists in this menu, add new menu item and
       * second "+" button.
       *
       * Else if two "+" buttons exist and user clicked first of these
       * buttons, add new menu item after "+" button.
       *
       * Else add new menu item before "+" button.
       */
      if ($(this).parent().children().length === 1) {
        let plusBtn = clonePlusBtn();
        plusBtn.on('click', function(eSubSub5) {
          plusBtnsProcedure(eSubSub5);
        });
        changeClickedBtnColorGen(plusBtn);
        $(this).after(menuItem);
        menuItem.after(plusBtn);
        
      } else if ($(this).parent().children()[0] === $(this)[0]) {
        $(this).after($(menuItem));
      } else {
        $(this).before($(menuItem));
      }
      /**
       * Clear text from text input
       */
      clearModInput();
      $(modId).modal('toggle');
    });
    $(modId).one('hidden.bs.modal', function() {
      $(e.currentTarget).off('createMenuItem');
      clearModInput();
      /**
       * Remove violation msg if exists
       */
      if (0 != $(modId).find('h6.violation-msg').length) {
        removeViolationMsg(modId);
      }
    });
  } while (false)
  $(modId).modal('toggle');
}

/**
 * Attachment "click" event handler function to all "+" buttons
 */
function enablePlusBtns() {
  $(plusBtnClass).on('click', function(e) {
    plusBtnsProcedure(e);
  });
}

/**
 * Part of saving new menu item procedure taken by "Zapisz tymczasowo" button.
 *
 * After retrieving name of menu item, that user wants to add, remove violation
 * message, if exists. 
 * Then validate provided name and check, that name is unique.
 * If name passed this test, trigger 'createMenuItem' event to create and add
 * new menu item to menus tree by another handler.
 *
 * @var {Event} e "Click" event.
 */
function saveBtnProcedure(e) {
  let elName = $(e.target).parents(modId).find('#menu_item_name')[0].value;
  do {
    if (0 != $(modId).find('h6.violation-msg').length) {
      removeViolationMsg(modId);
    }
    if (!validateItemName(elName)) {
      addViolationMsg('Wpisana nazwa zawiera niedozwolone znaki.', modId);
      break;
    }
    if (!checkUniquity(elName)) {
      addViolationMsg('Nazwa jest już zajęta.', modId);
      break;
    }
    $(plusBtnClass).trigger('createMenuItem', {'elName': elName});
  } while (false);
}

/**
 * Attach "click" event handler to "Zapisz tymczasowo" button.
 */
function enableSaveBtn() {
  $(saveBtnClass).on('click', function(e) {
    saveBtnProcedure(e);
  });
}

/**
 * Enable adding new menu item.
 */
function enableAddingMenuItem() {
  enablePlusBtns();
  enableSaveBtn();
}


//=============================================================================/
// 8. functions: CHANGING MENU ITEM
//=============================================================================/

/**
 * Procedure of changing name of menu item or removing menu item.
 *
 * @var {Event}  e    'contextmenu' event
 * @var {Object} data Object with current name of right-clicked menu item
 */
function menuItemBtnChangingProcedure(e, data) {
  e.preventDefault();
  do {
    /**
     * Check that user want to show or hide modal.
     */
    if ($(changeRemoveModId).hasClass('show')) {
      break;
    }
    /**
     * Pass menu item name to text input in purpose of editing this name.
     */
    enterTextForChangeRemoveModInput(data.elName);
    /**
     * Add event listener which reacts on clicking on "Zmień nazwę" button in
     * modal box.
     */
    $(e.currentTarget).one('editMenuItem', function(eSub1, data) {
      eSub1.stopPropagation();
      $(this).html(data.elName);
      /**
       * Clear text input
       */
      clearChangeRemoveModInput();
      /**
       * Close modal
       */
      $(changeRemoveModId).modal('toggle');
    });
    /**
     * Add event listener which reacts on clicking on "Usuń" button in
     * modal box.
     */
    $(e.currentTarget).one('removeMenuItem', function(eSub2) {
      eSub2.stopPropagation();
      let siblings = $(eSub2.currentTarget).parent().siblings();
      if (2 === siblings.length) {
        siblings[0].remove();
      }
      $(eSub2.currentTarget).parent('.dropdown-submenu').remove();
      //Dodać kod do usuwania menu itema

      //Sprawdzić, czy to był ostatni menu item z tego submenu (jest tak, gdy
      //liczba dzieci rodzica tego menu itema wynosi 3: + menu-item +).
      //Jeśli tak, to usunąć też "+" button na dole submenu.

      //Usuwając item, należy usunąć całe submenu, które jemu podlega.
      //eSub2.currentTarget.parent().remove();

      /**
       * Clear text input
       */
      clearChangeRemoveModInput();
      /**
       * Close modal
       */
      $(changeRemoveModId).modal('toggle');
    });
    /**
     * Remove above added event listeners, if user close modal box without
     * change name or removing menu item.
     */
    $(changeRemoveModId).one('hidden.bs.modal', function() {
      $(e.currentTarget).off('editMenuItem');
      $(e.currentTarget).off('removeMenuItem');
      /**
       * Remove violation msg if exists
       */
      if (0 != $(changeRemoveModId).find('h6.violation-msg').length) {
        removeViolationMsg(changeRemoveModId);
      }
      clearChangeRemoveModInput();
    });
  } while (false);
  /**
   * Toggle modal in all cases - if modal is shown or hidden.
   */
  $(changeRemoveModId).modal('toggle');
}

/**
 * Attach 'click' event handler to elements with 'menu-item' class.
 */
function enableMenuItemBtnChanging() {
  $(menuItem).on('contextmenu', function(e) {
    let elName = $(e.currentTarget).html();
    menuItemBtnChangingProcedure(e, {'elName': elName});
  });
}

/**
 * "Zmień nazwę" button procedure.
 *
 * @var {Event} e 'click' event
 */
function saveNameBtnProcedure(e) {
  let elName = $(e.target).parents(changeRemoveModId)
      .find('#change_menu_item_name')[0].value;
  do {
    if (0 != $(changeRemoveModId).find('h6.violation-msg').length) {
      removeViolationMsg(changeRemoveModId);
    }
    if (!validateItemName(elName)) {
      addViolationMsg('Wpisana nazwa zawiera niedozwolone znaki.',
        changeRemoveModId);
      break;
    }
    if (!checkUniquity(elName)) {
      addViolationMsg('Nazwa jest już zajęta.',
        changeRemoveModId);
      break;
    }
    $(menuItem).trigger('editMenuItem', {'elName': elName});
  } while (false);
}

/**
 * Attach 'click' event handler to "Zmień nazwę" button procedure.
 */
function enableSaveNameBtn() {
  $(saveNameBtnClass).on('click', function(e) {
    saveNameBtnProcedure(e);
  });
}

/**
 * "Usuń" button procedure.
 *
 * @var {Event} e 'click' event
 */
function deleteBtnProcedure(e) {
  $(menuItem).trigger('removeMenuItem');
}

/**
 * Attach 'click' event handler to "Usuń" button procedure.
 */
function enableDeleteBtn() {
  $(deleteBtnClass).on('click', function(e) {
    deleteBtnProcedure(e);
  });
}

/**
 * Enable editing and removing menu item.
 */
function enableChangingMenuItem() {
  enableMenuItemBtnChanging();
  enableSaveNameBtn();
  enableDeleteBtn();
}


//=============================================================================/
// 9. functions: DRAG&DROP MENU ITEMS
//=============================================================================/

/**
 * Make all submenus draggable
 */
function makeSubmenusDraggable() {
  $('.menu-item').attr('draggable', 'true');  
}

/**
 * Dropping procedure
 *
 * @var {Event} e "drop" event
 */
function droppingProcedure(e) {
  e.preventDefault();
  let dropped = $(e.target);
  do {
    /**
     * Check that user try to drop the element on itself
     */
    if (dropped[0] === dragged[0]) {
      break;
    }
    /**
     * Remove "+" button, if dragged element is alone in submenu
     */
    let numOfMenuItems = dragged.parent().parent()
        .children('.dropdown-submenu').length;
    if (1 === numOfMenuItems) {
      dragged.parent().parent().children('.add-menu-item').last().remove();
    }
    let lastMenuItem = dropped.parent().parent()
        .children('.dropdown-submenu').last()[0];
    /**
     * HierarchyRequestError is catched to prevent display information
     * information about it in console.
     */
    try {
      if (dropped.parent()[0] === lastMenuItem) {
        dropped.parent()[0].after(dragged.parent()[0]);
      } else {
        dropped.parent()[0].before(dragged.parent()[0]);
      }
    } catch (err) {}
  } while (false);
  dragged = dropped = undefined;
}

/**
 * Function for giving possibility to be dragged or dropped.
 *
 * @var {Object} menuItems Menu item or group of menu items, that we want to
 *                         give possibility to be dragged or dropped
 */
function dragDropMenuItem(menuItems) {
  menuItems.on('drag', function() {
    dragged = $(this);
  });
  menuItems.on('dragover', function(e) {
    e.preventDefault();
  });
  menuItems.on('drop', function(e) {
    droppingProcedure(e);
  });
}

/**
 * Give possibility to drag&drop to all '.menu-item'
 */
function dragDropAllMenuItems() {
  dragDropMenuItem($('.menu-item'));
}

/**
 * Enable dropping menu item to empty submenu.
 */
function droppingByPlusBtnProcedure(e) {
}

/**
 * Attach 'drop' event handler to "+" buttons
 */
function enableDroppingByPlusBtns() {
}


//=============================================================================/
// 10. functions: SEND INFORMATION ABOUT TREE TO SYMFONY CONTROLLER
//=============================================================================/

function saveNamesToArray(domMenusTree, arrayMenusTree) {
  do {
    if (0 === domMenusTree.children('.dropdown-submenu').length) {
      break;
    }
    //console.log(domMenusTree.children('.dropdown-submenu'));
    domMenusTree.children('.dropdown-submenu').each(function(index, element) {
      let nodeName = $(element).children('.menu-item').html();
      arrayMenusTree[nodeName] = {};
      saveNamesToArray(
        $(element).children('.dropdown-menu'),
        arrayMenusTree[nodeName]
      );
    })
  } while (false);

  return;
}

function savingChanges() {
  /**
   * Saving changes to database.
   */
  $('#save_to_db').on('click', function() {
    saveNamesToArray($('#menus-tree'), menusTree);
    let strMenusTree = JSON.stringify(menusTree);
    $(inputForTree).val(strMenusTree);
    let params = new URLSearchParams(window.location.search);
    let currentTreeId = params.get('id');
    $(inputForTreeId).val(currentTreeId);
    $('form[name="json_menu_tree"').submit();
  });
}
/*............................................................................*/