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

		dragEl.on('$destroy', function () {
			newScope.$destroy();
		});
	};

	vm.makeResizable = function() {

		var elems = angular.element(document.querySelectorAll(':not(resizable) > dnd-element'));

		angular.forEach(elems, function (el, key) {
			var el = angular.element(el);
			var dragZone = el.parent();
			var resizeEl = angular.element(
				'<resizable>' +
				'</resizable>'
			);

			var w = el.css('width');
			var h = el.css('height');
			dragZone.append(resizeEl);
			resizeEl.append(el);
			resizeEl.css({
			//	position: el.css('position'),
				left: el.css('left'),
				top: el.css('top'),
				width: w,
				height: h
			});

			el.prop('style', null);
			el.css({
				width: w,
				height: h
			});

			var newScope = $scope.$new(true);
			$compile(resizeEl)(newScope);

			resizeEl.on('$destroy', function () {
				newScope.$destroy();
			});

		});

	};

	vm.removeResizable = function () {

		var elems = angular.element(document).find('resizable');

		angular.forEach(elems, function (el, key) {
			var el = angular.element(el);
			var dragZone = el.parent();

			var dndEl = el.find('dnd-element').clone();

			dndEl.css({
				position: 'absolute',
				left: el.css('left'),
				top: el.css('top'),
				width: el.css('width'),
				height: el.css('height')
			});

			el.remove();
			dragZone.append(dndEl);

			var newScope = $scope.$new(true);
			$compile(dndEl)(newScope);

			dndEl.on('$destroy', function () {
				newScope.$destroy();
			});

		});
	}
}
