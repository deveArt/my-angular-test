/**
 * Select with search functionality
 */

angular
    .module('app.common')
    .component('selectImproved', {
        templateUrl: '/app/common/select-improved/select-improved.component.tmpl.html',
        controller: SelectImprovedController,
        bindings: {
            selvalue: '@',
            list: '<'
        }
    });

SelectImprovedController.$inject = ['globalVars', '$scope'];

/**
 * Select improved controller
 *
 * @constructor
 */
function SelectImprovedController(globalVars, $scope) {
    var $ctrl = this;

    let themes = [
        {name: 'primary', val: 'Dark blue'},
        {name: 'success', val: 'Green'},
        {name: 'info', val: 'Blue'},
        {name: 'warning', val:'Yellow'},
        {name: 'danger', val: 'Red'},
        {name: 'grey', val: 'Grey'},
        {name: 'codeit', val:'CodeIT'},
        {name: 'dark-red', val: 'Dark red'}
    ];

    $ctrl.expand = false;
    $ctrl.$postLink = init;
    $ctrl.hide = hide;
    $ctrl.setVal = setVal;

    function init() {
        if (!$ctrl.list) {
          $ctrl.list = themes;
        }

        $ctrl.current = globalVars.getVar($ctrl.selvalue);
    }

    function hide() {
        $ctrl.expand = false;
        return true;
    }

    function setVal(val) {
        $ctrl.current = val;
        globalVars.setVar($ctrl.selvalue, val);
    }
}
