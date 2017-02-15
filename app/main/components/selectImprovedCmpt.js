function SelectImprovedController() {
    var ctrl = this;

    ctrl.expand = false;

    ctrl.hide = function () {
        ctrl.expand = false;console.log(ctrl.expand);
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
