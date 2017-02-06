function SelectImprovedController() {
    var ctrl = this;

    ctrl.expand = false;
}

angular
    .module('app')
    .component('selectImproved', {
        templateUrl: '/app/main/views/selectImproved.html',
        controller: SelectImprovedController,
        bindings: {
            selvalue: '=',
            list: '='
        }
    });
