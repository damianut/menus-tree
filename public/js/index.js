'use strict';


//=============================================================================/
// CLASSES
//=============================================================================/

/**
 * Adding menu item.
 */
class addMenuItem {
  constructor() {
    this.modId = '#change-menu-item-modal';
    this.plusBtnClass = 'button.add-menu-item';
    this.saveBtnClass = 'button.modal-saving-btn';
  }

  /**
   * Cloning menu item with empty submenu
   */
  cloneMenuItem(elName) {
    let menuItem = $('#empty-submenu').clone();
    menuItem.removeAttr('id');
    menuItem.removeClass('d-none');
    menuItem.children()[0].value = elName;
  
    return menuItem;
  }
  
  /**
   * Cloning "+" button.
   */
  clonePlusBtn() {
    let plusBtn = $('#proto-plus-btn').clone();
    plusBtn.removeAttr('id');
    plusBtn.removeClass('d-none');
  
    return plusBtn;
  }

  /**
   * Change color of generally selected button(s)
   */
  changeClickedBtnColorGen(selected) {
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
  changeClickedBtnColor() {
    this.changeClickedBtnColorGen($('button.add-menu-item'));
  }

  /**
   * "click" event handler function for "+" button.
   *
   * By clicking "+" button user can toggle modal.
   * If modal is hidden, it will be shown and "createMenuItem" handler will be
   * attached to this "+" button. If modal closes without saving; this handler
   * will be detached.
   *
   * Else if modal is shown, modal is toggled only.
   */
  clickEvtHandler(e) {
    let modId = this.modId;
    let plusBtnClass = this.plusBtnClass;
    let saveBtnClass = this.saveBtnClass;
/*............................................................................*/
    do {
      if ($(modId).hasClass('show')) {
        break;
      }
      $(this).one('createMenuItem', function(e, data) {
        e.stopPropagation();
        let menuItem = cloneMenuItem(data.elName);
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
          $(this).after(menuItem);
          changeClickedBtnColorGen(plusBtn);
          $(this).parent().children('.dropdown-item').after(plusBtn);
          $(plusBtnClass).off('click');
          handlePlusBtn();
        } else if ($(this).parent().children()[0] === $(this)[0]) {
          $(this).after($(menuItemHtml));
        } else {
          $(this).before($(menuItemHtml));
        }
/*............................................................................*/
      /**
       *  data.elName - tutaj mam nazwę nowego elementu
       *  Utworzyć button z tą nazwą i nadać ID.
       *  Ustalić, czy naciśnięty button z plusikiem jest na górze czy dole
       *  Jeśli jest tylko jeden plusik, to pod nim dodać nowy element z nazwą,
       *  a potem dodać kolejny plusik (i nadać mu eventListener)
       *  A jak dwa, to dodać element tuż pod lub tuż nad buttonem z plusikiem.
       *  Oraz nadać odpowiednie eventListenery
       *  Jak wywołać event, który zostanie przechwycony przez dowolny button z plusikiem?
       */
      });
      $(modId).one('hidden.bs.modal', $(this), function(e) {
        $(e.data[0]).off('createMenuItem');
      });
    } while (false);
    $(modId).modal('toggle');
  }

  /**
   * Attachment "click" event handler function to all "+" buttons
   */
  enablePlusBtns() {
    $(plusBtnClass).on('click', function(e) {
      this.clickEvtHandler(e);
    });
  }

  /**
   * Prepare "Zapisz tymczasowo" button to take a part in add menu item process
   */
  enableSaveBtn() {
    let modId = this.modId;
    let plusBtnClass = this.plusBtnClass;
    let saveBtnClass = this.saveBtnClass;
    $(saveBtnClass).on('click', function() {
      let elName = $(this).parents(modId).find('#menu_item_name')[0].value;
      $(plusBtnClass).trigger('createMenuItem', {'elName': elName});
    });
  }
  
  /**
   * Enable adding new menu item.
   */
  enableAdding() {
    this.enablePlusBtns();
    this.enableSaveBtn();
  }
}

//=============================================================================/
// EXECUTED FUNCTIONS
//=============================================================================/

window.onload = function() {
  disableMenuClosing();
  multilevelMenusNesting();
  let menuItemCreator = new addMenuItem();
  menuItemCreator.changeClickedBtnColor();
  menuItemCreator.enableAdding();
  savingChanges();
}


//=============================================================================/
// FUNCTIONS
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
 * Allow showing and hiding menus nested on all levels.
 */
function multilevelMenusNesting() {
  $('.dropdown-submenu').on('click', function() {
    let visibility = $(this).children('.dropdown-menu').css('display');
    if ('none' === visibility) {
      $(this).children('.dropdown-menu').css('display', 'block');
    } else if ('block' === visibility) {
      $(this).children('.dropdown-menu').css('display', 'none');
    }
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