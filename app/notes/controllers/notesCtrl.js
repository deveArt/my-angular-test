angular
    .module('app')
    .controller('notesCtrl', NotesController);

NotesController.$inject = ['$scope', '$compile'];
function NotesController($scope, $compile) {

	var vm = this;

	const ncount_max = 10;
	vm.ncount = 0;
	vm.number = 0;
	vm.text = '';
	vm.dragScope = {};

	vm.addNote = function() {
		vm.ncount = angular.element(document).find('dnd-element').length;
		if (!vm.noteForm.$valid || vm.ncount >= ncount_max) {
			return false;
		}

		vm.number ++;
		var subject = 'Note #'+ vm.number;
		var dragZone = document.getElementById('dragZone');
		var dragEl = angular.element(
			'<dnd-element>' +
				'<p><b>'+subject+'</b></p>' +
				'<p>'+vm.text+'</p>' +
			'</dnd-element>'
		);

		angular.element(dragZone).append(dragEl);

		var newScope = $scope.$new(true);
		$compile(dragEl)(newScope);

	};

}
