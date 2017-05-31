angular
    .module('app.common')
    .service('dndData', dndData);

dndData.$inject = ['geometryService'];
function dndData(geometryService) {

    var self = this;

    self.register = register;
    self.addElement = addElement;
    self.deleteElement = deleteElement;
    self.moveElement = moveElement;
    self.getDropable = getDropable;

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
                bottom: zoneCoords.bottom,
                id: self.zones.length
            };

            self.zones.push(zone);
        } else {
            zone = self.zi < self.zoneCount
                ? self.zones[self.zi++]
                : self.zones[self.zi = 0, self.zi++];
        }

        return zone;
    }

    function addElement(element, zid) {
        self.zones[zid ? parseInt(zid): 0].dndElements.push(element);
    }

    function deleteElement(eid, zid) {
        return self.zones[zid].dndElements.splice(eid, 1)[0];
    }

    function moveElement(eid, zid, toZone) {
        if (zid === toZone) {
            return;
        }

        let element = deleteElement(eid, zid);

        addElement(element, toZone);
    }

    function getDropable() {
        return self.zones.filter(zone => zone.mode !== 'drag');
    }
}
