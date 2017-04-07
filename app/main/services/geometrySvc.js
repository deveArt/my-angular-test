var injectParams = [];

// @todo перенести нужные методы из dnd сюда

function geometryService() {

    this.getCoords = function (elem) {
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        var right = box.right + scrollLeft - clientLeft;
        var bottom = box.bottom + scrollTop - clientTop;

        return {
            top: Math.round(top),
            left: Math.round(left),
            right: Math.round(right),
            bottom: Math.round(bottom)
        };
    };
}

geometryService.$inject = injectParams;
angular.module('app').service('geomSvc', geometryService);
