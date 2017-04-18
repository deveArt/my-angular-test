angular
    .module('app.notes')
    .component('notes', {
        controller: NotesController,
        templateUrl: '/app/notes/notes.component.tmpl.html'
    });

NotesController.$inject = ['$scope', '$compile', 'geometryService'];
function NotesController($scope, $compile, geometryService) {

	var $ctrl = this;

	const ncount_max = 10;
	$ctrl.ncount = 0;
	$ctrl.number = 0;
	$ctrl.text = '';
	$ctrl.dragScope = {};
	$ctrl.resizeMode = false;

	$ctrl.addNote = function() {

		$ctrl.ncount = angular.element(document).find('dnd-element').length;
		if (!$ctrl.noteForm.$valid || $ctrl.ncount >= ncount_max) {
			return false;
		}

		$ctrl.number ++;
		var subject = 'Note #'+ $ctrl.number;
		var dragZone = document.getElementById('dragZone');
		var dragEl = angular.element(
			'<dnd-element>' +
				'<p><b>'+subject+'</b></p>' +
				'<p>'+$ctrl.text+'</p>' +
			'</dnd-element>'
		);

		angular.element(dragZone).append(dragEl);

		var newScope = $scope.$new(true);
		$compile(dragEl)(newScope);

		dragEl.on('$destroy', function () {
			newScope.$destroy();
		});

		$ctrl.text = '';
		$ctrl.noteForm.$setPristine();
	};

	$ctrl.makeResizable = function() {

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

	$ctrl.removeResizable = function () {

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

	$ctrl.resizeRefresh = function () {

		if (!$ctrl.resizeMode) {
			return;
		}

		var elems = angular.element(document.querySelectorAll('resizable:empty'));
		elems.remove();

		$ctrl.makeResizable();

	};

	$ctrl.toggleResize = function () {
		if ($ctrl.resizeMode) {
			$ctrl.removeResizable();
			$ctrl.resizeMode = false;
		} else {
			$ctrl.makeResizable();
			$ctrl.resizeMode = true;
		}
	};
}
