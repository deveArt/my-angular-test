/**
 * Provides a way to capture whenever a click happens outside of an element (even if the element has no blur event). Due
 * to performance optimization, this DOES NOT run an $apply after the onClickOut handler unless you return true. e.g.
 *
 *      <z-click-out ng-if="editMode" on-click-out="finishEditing()" selector=".task-edit"></z-click-out>
 *
 * @binding selector The string of what does not trigger the click out. This can be any valid jQuery selector and can
 *                   specify multiple elements.
 * @binding onClickOut This is called when the element is no longer clicked on. Return true to do a $apply. But do so
 *                     carefully because $apply are very expensive and can have large performance penalties when there
 *                     are lots of other clickouts. For example, in grids.
 * @binding fromParent If true, the selector will be applied from the parent on this element instead of the document.
 */
angular
    .module('app')
    .component('zClickOut', {
        controller: zClickOutController,
        bindings: {
            selector: '@',
            onClickOut: '&',
            fromParent: '@',
        }
    });

zClickOutController.$inject = ['$window', '$document', '$element', '$timeout', '$scope', '$attrs'];
function zClickOutController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;
console.dir(angular.element($window));
    $ctrl.$postLink = $postLink;

    function $postLink() {
        setupForTests();

        document.onmousedown = checkIfClickOutsideSelectionArea;
        angular.element($window).on('blur' ,checkIfClickOutsideSelectionArea);
        // There is no point in listening for click outs when the element is no longer used by Angular.
        $scope.$on('$destroy', function () {
            document.onmousedown = null;
            angular.element($window).unbind('blur', checkIfClickOutsideSelectionArea);
        });
    }

    /**
     * For testing only. Normal triggering does not seem to work well. See global.test-helper.js
     */
    function setupForTests() {
        if (window.zTest) {
            window.zTest.clickOutEvents = window.zTest.clickOutEvents || {};
            window.zTest.clickOutEvents[$attrs.selector] = function() {
                $ctrl.onClickOut();
                $scope.$apply();
            };
        }
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
     * @param  {Object} pointer The jQuery Event object which gives the mouse pointer position.
     *
     * @return {Boolean} If the pointer is in the given element.
     */
    function collisionOnPoint(ele, pointer) {
        var bounds = getAbsoluteTopLeft(ele[0]),
            leftEdge = bounds.left,
            topEdge = bounds.top,
            bottomEdge = topEdge + ele.outerHeight(true),
            rightEdge = leftEdge + ele.outerWidth(true);

        return pointer.pageX >= leftEdge && pointer.pageX <= rightEdge &&
            pointer.pageY >= topEdge && pointer.pageY <= bottomEdge;
    }

    /**
     * Call the bound clickOut method. If it returns true, do a $apply in this scope.
     */
    function doClickOut() {
        var result = $ctrl.onClickOut();
        if (result === true) {
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
        var container = $ctrl.fromParent === 'true' ? $element.parent().find($ctrl.selector) : $document.find($ctrl.selector);
console.log(container.length);
        window.sss = $document;
        if (container.length === 0) {
            doClickOut();
            return undefined;
        }

        var containers = container.length === 1 ? [container] : container;
        for (var i = 0; i < containers.length; i += 1) {
            if (collisionOnPoint(angular.element(containers[i]), e) === true) {
                return undefined;
            }
        }

        if (container.is(e.target) || container.has(e.target).length > 0) {
            return undefined;
        }

        doClickOut();

        return undefined;
    }
}
