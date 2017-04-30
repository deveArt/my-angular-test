angular
    .module('app.common')
    .service('geometryService', geometryService);

function geometryService() {

    /**
    * Get geometry values of the element
    *
    **/
    this.getCoords = function(elem) {
        let box = elem.getBoundingClientRect();

        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;

        let top  = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        let right = box.right + scrollLeft - clientLeft;
        let bottom = box.bottom + scrollTop - clientTop;

        return {
            top: Math.round(top),
            left: Math.round(left),
            right: Math.round(right),
            bottom: Math.round(bottom),
            width: box.width,
            height: box.height
        };
    };

    /**
    * Find target under cursor
    *
    **/
    this.getElementUnderClientXY = function(elem, clientX, clientY) {
        let display = elem.style.display || '';
        elem.style.display = 'none';

        let target = document.elementFromPoint(clientX, clientY);

        elem.style.display = display;

        if (!target || target == document) { // это бывает при выносе за границы окна
            target = document.body;
        }

        return target;
    };
}
