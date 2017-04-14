/**
 * Select with search functionality
 */

angular
    .module('app.common')
    .component('selectImproved', {
        templateUrl: '/app/common/select-improved/select-improved.component.tmpl.html',
        controller: SelectImprovedController,
        bindings: {
            selvalue: '=',
            list: '<'
        }
    });

/**
 * Select improved controller
 * 
 * @constructor
 */
function SelectImprovedController() {
  var $ctrl = this;

  $ctrl.expand = false;

  $ctrl.hide = function () {
      $ctrl.expand = false;
      return true;
  };
}
