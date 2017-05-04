angular
    .module('app.common')
    .service('storageService', storageService);

function storageService() {

    let self = this;

    self.getLocal = getLocal;
    self.setLocal = setLocal;

    function getLocal(key) {
        let item = localStorage.getItem(key);
        return (item ? JSON.parse(item) : null);
    }

    function setLocal(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
        return self;
    }
}
