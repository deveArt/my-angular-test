function SelectImprovedController() {
    var vm = this;

    console.dir(vm);
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
