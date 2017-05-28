angular
    .module('app.common')
    .service('dndData', dndData);

function dndData() {

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

    function register() {
        let zone;

        if (self.zones.length < self.zoneCount) {
            zone = [];

            self.zones.push(zone);
        } else {
            zone = self.zi < self.zoneCount
                ? self.zones[self.zi++]
                : self.zones[self.zi = 0, self.zi++];
        }

        return zone;
    }

    function addElement(el, z) {
        self.zones[z ? parseInt(z): 0].push(el);
    }

}
