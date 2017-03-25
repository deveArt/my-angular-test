angular
    .module('app')
    .controller('notesCtrl', NotesController);

NotesController.$inject = ['$scope', '$compile'];
function NotesController($scope, $compile) {

	var vm = this;

	vm.ncount = 0;
	vm.text = '';
	vm.dragScope = {};

	vm.addNote = function() {
		if (!vm.noteForm.$valid) {
			return false;
		}

		vm.ncount++;
		var subject = 'Note #'+ vm.ncount;

		var dragZone = document.getElementById('dragZone');

		var dragHtml = '<dnd-element><b>'+subject+'</b><p>'+vm.text+'</p></dnd-element>';
		angular.element(dragZone).append(dragHtml);

		var newScope = $scope.$new(true);
		$compile(dragZone)(newScope);

	};
}
