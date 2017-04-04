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
		vm.makeResizable();

		//var newScope = $scope.$new(true);
		//$compile(dragEl)(newScope);

		dragEl.on('$destroy', function () {
			newScope.$destroy();
		});
	};

	vm.makeResizable = function() {
		vm.removeResizable();

		var elem = angular.element(document.querySelector(':not(resizable) > dnd-element'));
		var resizeEl = angular.element(
			'<resizable>' +
			'</resizable>'
		);

		var dragZone = elem.parent();
		dragZone.append(resizeEl);
		resizeEl.append(elem);
		// resizeEl.css({
		// 	position: elem.css('position'),
		// 	left: elem.css('left'),
		// 	top: elem.css('top')
		// });

		var newScope = $scope.$new(true);
		$compile(resizeEl)(newScope);

		resizeEl.on('$destroy', function () {
			newScope.$destroy();
		});
	};

	vm.removeResizable = function () {console.log(angular.element(document.querySelector('resizable:empty')));
		angular.element(document.querySelector('resizable:empty')).remove();
	}
}
