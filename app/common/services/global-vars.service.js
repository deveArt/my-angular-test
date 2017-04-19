angular
    .module('app.common')
    .service('globalVars', globalVars);

function globalVars() {

    var self = this;

    var vars = {};

    self.getVar = getVar;
    self.setVar = setVar;
    self.data = vars;

    function setVar(key, item) {
        vars[key] = item;
        return self;
    }

    function getVar(key) {
        return vars[key] !== undefined ? vars[key]: null;
    }

}
