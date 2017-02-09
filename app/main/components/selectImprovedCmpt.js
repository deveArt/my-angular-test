function SelectImprovedController() {
    var ctrl = this;

    ctrl.toggle = function () {
        ctrl.expand = !ctrl.expand;
        console.log(ctrl);
    }
}

angular
    .module('app')
    .component('selectImproved', {
        templateUrl: '/app/main/views/selectImproved.html',
        controller: SelectImprovedController,
        bindings: {
            selvalue: '=',
            list: '=',
            expand: '='
        }
    });
