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
}