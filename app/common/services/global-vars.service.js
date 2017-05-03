angular
    .module('app.common')
    .service('globalVars', globalVars);

function globalVars() {

    let self = this;

    let vars = {};

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
