'use strict';


//=============================================================================/
// GLOBAL VARIABLES
//=============================================================================/

var modId = '#change-menu-item-modal';
var plusBtnClass = 'button.add-menu-item';
var saveBtnClass = 'button.modal-saving-btn';


//=============================================================================/
// EXECUTED FUNCTIONS
//=============================================================================/

window.onload = function() {
  disableMenuClosing();
  multilevelMenusNesting();
  changeClickedBtnColor();
  enableAdding();
  savingChanges();
}


//=============================================================================/
// DEFINITIONS OF FUNCTIONS
//=============================================================================/

//=============================================================================/
// functions: VALIDATION
//=============================================================================/

/**
 * Check that name contains only alphanumeric chars and space.
 *
 * Return true, if name is valid. False otherwise.
 */
function validateItemName(itemName) {
  let regex = new RegExp("[^\\w\\s]+", "m");

  return !regex.test(itemName);
}

/**
 * Add violation message to modal.
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
// functions: ALLOW MENUS NESTING
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

/**
 * "click" event handler that showing and hiding menus nested on all levels.
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
// functions: CONTACT WITH DATABASE
//=============================================================================/

function savingChanges() {
  /**
   * Saving changes to database.
   */
  $('#save_to_db').on('click', function() {
    
  });
}


//=============================================================================/
// functions: ADDING MENU ITEM
//=============================================================================/

/**
 * Cloning menu item with empty submenu
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
 * Change color of generally selected button(s)
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

/**
 * Check that user provided unique name.
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

/**
 * Procedure which taken place when "click" event on "+" button is fired.
 *
 * By clicking "+" button user can toggle modal.
 * If modal is hidden, it will be shown and "createMenuItem" handler will be
 * attached to this "+" button. If modal closes without saving; this handler
 * will be detached.
 *
 * Else if modal is shown, modal is toggled only.
 */
function plusBtnsProcedure(e) {
  do {
    if ($(modId).hasClass('show')) {
      break;
    }
    $(e.target).one('createMenuItem', function(eSub, data) {
      eSub.stopPropagation();
      /**
       * Clone new element of menu.
       */
      let menuItem = cloneMenuItem(data.elName);
      /**
       * Allow showing and hiding submenus after clicking on this element.
       */
      menuItem.on('click', function(eSubSub) {
        multilevelMenusNestingHandler(eSubSub);
      });
      /**
       * Disable closing menu by clicking on menu.
       *
       * Stop propagation of "click" event to prevent closing menus by clicking
       * another button, than button with "+" sign.
       */
      menuItem.find('.dropdown-menu').on('click', function(eSubSub2) {
        eSubSub2.stopPropagation();
      });
      /**
       * New menu contains "+" button. Below handler was attach on all buttons
       * with 'add-menu-item' class while site loading. This event handler
       * should also be attached to buttons created later.
       */
      menuItem.find(plusBtnClass).on('click', function(evtSub) {
        plusBtnsProcedure(evtSub);
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
        plusBtn.on('click', function(evtSub) {
          plusBtnsProcedure(evtSub);
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
    $(modId).one('hidden.bs.modal', $(this), function(e) {
      $(e.data[0]).off('createMenuItem');
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
 * Prepare "Zapisz tymczasowo" button to take a part in add menu item process
 *
 * After retrieving name of menu item, that user wants to add, remove violation
 * message, if exists. 
 * Then validate provided name and check, that name is unique.
 * If name passed this test, trigger 'createMenuItem' event to create and add
 * new menu item to menus tree by another handler.
 */
function enableSaveBtn() {
  $(saveBtnClass).on('click', function() {
    let elName = $(this).parents(modId).find('#menu_item_name')[0].value;
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
  });
}

/**
 * Enable adding new menu item.
 */
function enableAdding() {
  enablePlusBtns();
  enableSaveBtn();
}
/*............................................................................*/
//=============================================================================/
// functions: MODAL
//=============================================================================/

/**
 * Manually toggle a modal.
 *
 * Event handling procedure is added to buttons with "+" sign. This event
 * in this case is 'click'.
 *
 * If modal is shown, modal is only toggled. Else below actions are prepend:
 *
 * In this case 'createMenuItem' event listener is added. 'createMenuItem'
 * event occurs, when user clicks button with description: "Zapisz tymczasowo".
 *
 * Then 'hidden.bs.modal' event listener is added to remove previous event
 * listener, if user close modal without clicking button "Zapisz tymczasowo".
 * If user clicked "Zapisz tymczasowo" and close modal; event listener isn't
 * removed.
 */