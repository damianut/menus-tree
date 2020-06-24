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


//=============================================================================/
// EXECUTED FUNCTIONS
//=============================================================================/

window.onload = function() {
  disableMenuClosing();
  multilevelMenusNesting();
  changeClickedBtnColor();
  enableAddingMenuItem();
  enableChangingMenuItem();
  savingChanges();
}


//=============================================================================/
// DEFINITIONS OF FUNCTIONS
//
// Order of function groups in this file:
// 1. Validation
// 2. Check uniquity of new menu item name
// 3. Improving user comfort while creating menu
// 4. Styles
// 5. Allowing menu nesting
// 6. Adding menu item
// 7. Changing menu item
// .. Contact with database
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
 */
function addViolationMsg(violationMsg) {
  let violationEl =
    '<h6 class="text-danger font-weight-bold violation-msg">' + violationMsg +
    '</h6>';
  $(modId).find('h6').after(violationEl);
}

/**
 * Remove violation message from modal.
 */
function removeViolationMsg() {
  $(modId).find('h6.violation-msg').remove();
}


//=============================================================================/
// 2. functions: CHECK UNIQUITY OF NEW MENU ITEM NAME
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
// 3. functions: IMPROVING USER COMFORT WHILE CREATING MENU
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
// 4. functions: STYLES
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
// 5. functions: ALLOWING MENUS NESTING
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
// 6. functions: ADDING MENU ITEM
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
    $(e.target).one('createMenuItem', function(eSub1, data) {
      eSub1.stopPropagation();
      /**
       * Clone new element of menu.
       */
      let menuItem = cloneMenuItem(data.elName);
      /**
       * Allow showing and hiding submenus after clicking on this element.
       */
      menuItem.on('click', function(eSubSub1) {
        multilevelMenusNestingHandler(eSubSub1);
      });
      /**
       * Allow editing and removing this menu item
       */
      menuItem.on('contextmenu', function(eSubSub2) {
        let elName = menuItem[0].innerText;
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
      $(modId).find('#menu_item_name').val('');
      $(modId).modal('toggle');
    });
    $(modId).one('hidden.bs.modal', $(this), function(eSub2) {
      $(eSub2.data[0]).off('createMenuItem');
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
      removeViolationMsg();
    }
    if (!validateItemName(elName)) {
      addViolationMsg('Wpisana nazwa zawiera niedozwolone znaki.');
      break;
    }
    if (!checkUniquity(elName)) {
      addViolationMsg('Nazwa jest już zajęta.');
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
// 7. functions: CHANGING MENU ITEM
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
    $(e.target).one('editMenuItem', function(eSub1, data) {
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
    $(e.target).one('removeMenuItem', function(eSub2) {
      eSub2.stopPropagation();
      console.log($(eSub2.currentTarget).parent('.dropdown-submenu').children('.dropdown-menu').children().length);
      //$(eSub2.currentTarget).parent('.dropdown-submenu').remove();
      //$(eSub2.currentTarget).remove();
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
    $(changeRemoveModId).one('hidden.bs.modal', $(this), function(eSub3) {
      $(eSub3.data[0]).off('editMenuItem');
      $(eSub3.data[0]).off('removeMenuItem');
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
  $(menuItem).trigger('editMenuItem', {'elName': elName});
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
// . functions: CONTACT WITH DATABASE
//=============================================================================/

function savingChanges() {
  /**
   * Saving changes to database.
   */
  $('#save_to_db').on('click', function() {
    
  });
}
/*............................................................................*/