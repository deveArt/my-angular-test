angular
    .module('app.common')
    .service('dndData', dndData);

dndData.$inject = ['geometryService'];
function dndData(geometryService) {

    var self = this;

    self.register = register;
    self.addElement = addElement;
    self.zones = [];
    self.zoneCount = 0;
    self.zi = 0;
    init();

    function init() {
        self.zoneCount = angular.element(document).find('dnd-zone').length;
    }

    function register($element) {
        let zone;

        if (self.zones.length < self.zoneCount) {
            let zoneCoords = geometryService.getCoords($element);

            zone = {
                dndElements: [],
                left: zoneCoords.left,
                right: zoneCoords.right,
                top: zoneCoords.top,
                bottom: zoneCoords.bottom
            };
            
            self.zones.push(zone);
        } else {
            zone = self.zi < self.zoneCount
                ? self.zones[self.zi++]
                : self.zones[self.zi = 0, self.zi++];
        }

        return zone;
    }

    function addElement(el, z) {
        self.zones[z ? parseInt(z): 0].dndElements.push(el);
    }

}
