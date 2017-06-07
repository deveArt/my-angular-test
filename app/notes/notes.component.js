angular
    .module('app.notes')
    .component('notes', {
        controller: NotesController,
        templateUrl: '/app/notes/notes.component.tmpl.html'
    });

NotesController.$inject = ['$scope', '$compile', 'geometryService', 'globalVars', 'dndData'];
function NotesController($scope, $compile, geometryService, globalVars, dndData) {

	var $ctrl = this;

	const ncount_max = 10;
	$ctrl.globalVars = globalVars.data;
	$ctrl.ncount = 0;
	$ctrl.number = 0;
	$ctrl.text = '';
	$ctrl.dragScope = {};
	$ctrl.state = dndData.getState();

	$ctrl.addNote = addNote;
	$ctrl.removeResizable = removeResizable;
	$ctrl.resizeRefresh = resizeRefresh;
    $ctrl.toggleResize = toggleResize;

    $ctrl.zones = dndData.zones;

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
		dndData.resizeSwitch();
    }

    function addNote() {

		if (!$ctrl.noteForm.$valid || dndData.elCount >= ncount_max) {
			return false;
		}

        dndData.addElement({
            text: $ctrl.text,
            style: {}
        });

		$ctrl.text = '';
		$ctrl.noteForm.$setPristine();
	}
}
