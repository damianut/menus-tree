'use strict';

window.onload = function() {
  $('.dropdown-menu').on('click', function(e) {
    e.stopPropagation();
  });
  $('.dropdown-submenu').on('click', function() {
    let visibility = $(this).children('.dropdown-menu').css('display');
    if ('none' === visibility) {
      $(this).children('.dropdown-menu').css('display', 'block');
    } else if ('block' === visibility) {
      $(this).children('.dropdown-menu').css('display', 'none');
    }
  });
  /**
   * Change color of button while clicking
   */
  $('button.add-menu-item').on('mousedown', function() {
    $(this).css('background-color', 'rgb(40, 167, 69)');
    $(this).removeClass('text-dark');
    $(this).addClass('text-light');
  });
  $('button.add-menu-item').on('mouseup', function() {
    $(this).css('background-color', 'rgb(248, 249, 250)');
    $(this).removeClass('text-light');
    $(this).addClass('text-dark');
  });
}