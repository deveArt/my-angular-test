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

			var newEl = el.clone();
			dragZone.append(resizeEl);
			resizeEl.append(newEl);
			resizeEl.css({
				position: 'absolute',
				left: el.css('left'),
				top: el.css('top'),
				zIndex: el.css('z-index'),
				width: w,
				height: h
			});

			el.remove();

			newEl.prop('style', null);
			newEl.css({
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

			var _dndEl = el.find('dnd-element');

			el.remove();

			if ( _dndEl.length > 0 ) {
				var elCss = {
					position: 'absolute',
					left: el.css('left'),
					top: el.css('top'),
					zIndex: el.css('z-index'),
					width: _dndEl.css('width'),
					height: _dndEl.css('height')
				};

				var dndEl = _dndEl.clone();
				dndEl.css(elCss);

				dragZone.append(dndEl);

				var newScope = $scope.$new(true);
				$compile(dndEl)(newScope);

				dndEl.on('$destroy', function () {
					newScope.$destroy();
				});
			}

		});
	}
}
