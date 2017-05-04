angular
    .module('app.notes')
    .component('notes', {
        controller: NotesController,
        templateUrl: '/app/notes/notes.component.tmpl.html'
    });

NotesController.$inject = ['$scope', '$compile', 'geometryService', 'globalVars'];
function NotesController($scope, $compile, geometryService, globalVars) {

	var $ctrl = this;

	const ncount_max = 10;
	$ctrl.globalVars = globalVars.data;
	$ctrl.ncount = 0;
	$ctrl.number = 0;
	$ctrl.text = '';
	$ctrl.dragScope = {};
	$ctrl.resizeMode = false;

	$ctrl.addNote = addNote;
	$ctrl.makeResizable = makeResizable;
	$ctrl.removeResizable = removeResizable;
	$ctrl.resizeRefresh = resizeRefresh;
    $ctrl.toggleResize = toggleResize;

    function makeResizable() {

        let elems = angular.element(document.querySelectorAll(':not(resizable) > dnd-element'));

        angular.forEach(elems, function (domEl, key) {
            let _el = domEl;
            let el = angular.element(domEl);

            if (_el.parentNode.mode !== 'drop') {
                return;
            }

            let dragZone = el.parent();
            let resizeEl = angular.element(
                '<resizable>' +
                '</resizable>'
            );

            let position = geometryService.getCoords(_el);

            let newEl = el.clone();
            dragZone.append(resizeEl);
            resizeEl.css({
                position: el.css('position'),
                left: el.css('left'),
                top: el.css('top'),
                zIndex: el.css('z-index'),
                width: position.width + 'px',
                height: position.height + 'px'
            });

            el.remove();

            newEl.prop('style', null);
            newEl.css({
                width: position.width + 'px',
                height: position.height + 'px'
            });

            resizeEl.append(newEl);

            let newScope = $scope.$new(true);
            $compile(resizeEl)(newScope);

            resizeEl.on('$destroy', function () {
                newScope.$destroy();
            });

        });

    }

    function removeResizable() {

        let elems = angular.element(document).find('resizable');

        angular.forEach(elems, function (domEl, key) {
            let el = angular.element(domEl);
            let dragZone = el.parent();

            let _dndEl = el.find('dnd-element');

            el.remove();

            if ( _dndEl.length > 0 ) {
                let elCss = {
                    position: el.css('position'),
                    left: el.css('left'),
                    top: el.css('top'),
                    zIndex: el.css('z-index'),
                    width: _dndEl.css('width'),
                    height: _dndEl.css('height')
                };

                let dndEl = _dndEl.clone();
                dndEl.css(elCss);

                dragZone.append(dndEl);

                let newScope = $scope.$new(true);
                $compile(dndEl)(newScope);

                dndEl.on('$destroy', function () {
                    newScope.$destroy();
                });
            }

        });
    }

    function resizeRefresh() {

		if (!$ctrl.resizeMode) {
			return;
		}

		let elems = angular.element(document.querySelectorAll('resizable:empty'));
		elems.remove();

		$ctrl.makeResizable();

	}

    function toggleResize() {
        if ($ctrl.resizeMode) {
            $ctrl.removeResizable();
            $ctrl.resizeMode = false;
        } else {
            $ctrl.makeResizable();
            $ctrl.resizeMode = true;
        }
    }

    function addNote() {

		$ctrl.ncount = angular.element(document).find('dnd-element').length;
		if (!$ctrl.noteForm.$valid || $ctrl.ncount >= ncount_max) {
			return false;
		}

		$ctrl.number ++;
		let subject = 'Note #'+ $ctrl.number;
		let dragZone = document.getElementById('dragZone');
		let dragEl = angular.element(
			'<dnd-element>' +
				'<p><b>'+subject+'</b></p>' +
				'<p>'+$ctrl.text+'</p>' +
			'</dnd-element>'
		);

		angular.element(dragZone).append(dragEl);

		let newScope = $scope.$new(true);
		$compile(dragEl)(newScope);

		dragEl.on('$destroy', function () {
			newScope.$destroy();
		});

		$ctrl.text = '';
		$ctrl.noteForm.$setPristine();
	}
}
