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
    self.resizeSwitch = resizeSwitch;
    self.getState = getState;
    self.getElement = getElement;
    
    init();

    function init() {
        self.state = {
            resizeMode: false
        };
        self.zones = [];
        self.zi = 0;
        self.elCount = 0;
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
        self.elCount++;
    }

    function deleteElement(eid, zid) {
        self.elCount--;
        return self.zones[zid].dndElements.splice(eid, 1)[0];
    }

    function moveElement(eid, zid, toZone) {
        if (zid === toZone) {
            return;
        }

        let element = deleteElement(eid, zid);

        addElement(element, toZone);
    }

    function getElement(eid, zid) {
        return self.zones[zid].dndElements[eid];
    }
    
    function getDropable() {
        return self.zones.filter(zone => zone.mode !== 'drag');
    }
    
    function resizeSwitch() {console.log(self.state);
        self.state.resizeMode = !self.state.resizeMode;
    }

    function getState() {
        return self.state;
    }
}
