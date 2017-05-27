angular
    .module('app.common')
    .service('dndData', dndData);

function dndData() {

    var self = this;

    self.register = register;
    self.addElement = addElement;
    self.zones = [];

    function register(zid) {
        let zone;
console.log(zid);
        if (zid !== undefined) {
            zone = self.zones[zid];
        } else {
            zone = [];

            self.zones.push(zone);

            zid = self.zones.length - 1;
        }

        return {zone: zone, zid: zid};
    }

    function addElement(el, z) {
        self.zones[z ? parseInt(z): 0].push(el);
    }
}
