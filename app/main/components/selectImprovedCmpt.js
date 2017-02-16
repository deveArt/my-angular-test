function SelectImprovedController() {
    var $ctrl = this;

    $ctrl.expand = false;

    $ctrl.hide = function () {
        $ctrl.expand = false;
        return true;
    };
}

angular
    .module('app')
    .component('selectImproved', {
        templateUrl: '/app/main/views/selectImproved.html',
        controller: SelectImprovedController,
        bindings: {
            selvalue: '=',
            list: '<'
        }
    });
