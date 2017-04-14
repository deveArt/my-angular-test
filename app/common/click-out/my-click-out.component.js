/**
 * Provides a way to capture whenever a click happens outside of an element (even if the element has no blur event). Due
 * to performance optimization, this DOES NOT run an $apply after the onClickOut handler unless you return true. e.g.
 *
 *      <my-click-out ng-if="editMode" on-click-out="finishEditing()" selector=".task-edit"></my-click-out>
 *
 * @binding selector The string of what does not trigger the click out. This can be any valid jQuery selector and can
 *                   specify multiple elements.
 * @binding onClickOut This i   s called when the element is no longer clicked on. Return true to do a $apply. But do so
 *                     carefully because $apply are very expensive and can have large performance penalties when there
 *                     are lots of other clickouts. For example, in grids.
 */
angular
    .module('app.common')
    .component('myClickOut', {
        controller: MyClickOutController,
        bindings: {
            selectors: '<',
            onClickOut: '&'
        }
    });

MyClickOutController.$inject = ['$window', '$element', '$scope'];
function MyClickOutController($window, $element, $scope) {
    var $ctrl = this;

    $ctrl.$postLink = $postLink;

    function $postLink() {

        document.onmousedown = checkIfClickOutsideSelectionArea;
        angular.element($window).on('blur' ,checkIfClickOutsideSelectionArea);
        // There is no point in listening for click outs when the element is no longer used by Angular.
        $scope.$on('$destroy', function () {
            document.onmousedown = null;
            angular.element($window).unbind('blur', checkIfClickOutsideSelectionArea);
        });
    }

    /**
     * Get the real absolute element position. Offset based methods, including those with offsetParent included are
     * buggy. This gets the bounding rectangle position of an element in the current viewport then adds the scroll.
     * Finally, the body borders are subtracted just in case.
     *
     * @param  {Object} ele The raw DOM element.
     *
     * @return {Object} Contains the top and left properties of an element for the entire page.
     */
    function getAbsoluteTopLeft(ele) {
        var box = ele.getBoundingClientRect();

        // Math.round because it is actually possible to get fractional pixels.
        return {
            top: Math.round(box.top +  window.pageYOffset - document.body.clientTop),
            left: Math.round(box.left + window.pageXOffset - document.body.clientLeft)
        };
    }

    /**
     * Point collision detection (is the mouse in the element?).
     *
     * @param  {Object} ele The Angular element to check for if the mouse is in
     * @param  {Object} pointer The jQuery Event obje   ct which gives the mouse pointer position.
     *
     * @return {Boolean} If the pointer is in the given element.
     */
    function collisionOnPoint(ele, pointer) {
        var bounds = getAbsoluteTopLeft(ele),
            leftEdge = bounds.left,
            topEdge = bounds.top,
            bottomEdge = topEdge + ele.offsetHeight,
            rightEdge = leftEdge + ele.offsetWidth;

        return pointer.pageX >= leftEdge && pointer.pageX <= rightEdge &&
            pointer.pageY >= topEdge && pointer.pageY <= bottomEdge;
    }

    /**
     * Call the bound clickOut method. If it returns true, do a $apply in this scope.
     */
    function doClickOut() {
        if ($ctrl.onClickOut()) {
            $scope.$apply();
        }
    }

    /**
     * Checks if the selection is outside of the selection area in 2 steps. If any of the steps succeed, the
     * clickout is fired and the other steps are not visited:
     * 1. If the container cannot be found
     * 2. If the container can be found check if the mouse is in the element
     * 3. If the mouse is not in the element, check if the target element is the element or is a child of it. Some
     *    elements have no height, so this 3rd step is necessary.
     * This algorithm assumes that clickout events are very frequent as most elements do not cover much of the
     * screen. So non-clickouts are computationally expensive instead.
     *
     * @param  {Object} e The event from the browser
     *
     * @return {undefined}
     */
    function checkIfClickOutsideSelectionArea(e) {
        if( typeof $ctrl.selectors === 'string' ) {
            $ctrl.selectors = [ $ctrl.selectors ];
        }

        var container = [];
        $ctrl.selectors.forEach(function (sel) {
            var match = $element.parent().find(sel);

            angular.forEach(match, function (subEl) {
                container.push(subEl);
            });

        });

        if (container.length === 0) {
            doClickOut();
            return null;
        }

        var res = [];
        container.forEach(function (el) {
            res.push(collisionOnPoint(el, e));
        });

        if (res.some(function (val) {
            return val === true;
        })) {
            return null;
        }

        doClickOut();
    }
}
