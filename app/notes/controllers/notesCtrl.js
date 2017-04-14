angular
    .module('app')
    .controller('notesCtrl', NotesController);

NotesController.$inject = ['$scope', '$compile', 'geometryService'];
function NotesController($scope, $compile, geometryService) {

	var vm = this;

	const ncount_max = 10;
	vm.ncount = 0;
	vm.number = 0;
	vm.text = '';
	vm.dragScope = {};
	vm.resizeMode = false;
	
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

		vm.text = '';
		vm.noteForm.$setPristine();
	};

	vm.makeResizable = function() {

		var elems = angular.element(document.querySelectorAll(':not(resizable) > dnd-element'));

		angular.forEach(elems, function (el, key) {
			var _el = el;
			var el = angular.element(el);

			if (_el.parentNode.mode !== 'drop') {
				return;
			}

			var dragZone = el.parent();
			var resizeEl = angular.element(
				'<resizable>' +
				'</resizable>'
			);

			var position = geometryService.getCoords(_el);

			var newEl = el.clone();
			dragZone.append(resizeEl);
			resizeEl.css({
				position: el.css('position'),
				left: el.css('left'),
				top: el.css('top'),
				zIndex: el.css('z-index'),
				width: position.width + 'px',
				height: position.height + 'px',
			});

			el.remove();

			newEl.prop('style', null);
			newEl.css({
				width: position.width + 'px',
				height: position.height + 'px'
			});

			resizeEl.append(newEl);

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
					position: el.css('position'),
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
		
	};
	
	vm.resizeRefresh = function () {

		if (!vm.resizeMode) {
			return;
		}
		
		var elems = angular.element(document.querySelectorAll('resizable:empty'));
		elems.remove();

		vm.makeResizable();
		
	};

	vm.toggleResize = function () {
		if (vm.resizeMode) {
			vm.removeResizable();
			vm.resizeMode = false;
		} else {
			vm.makeResizable();
			vm.resizeMode = true;
		}
	};
}
