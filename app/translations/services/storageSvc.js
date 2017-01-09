angular
    .module('app')
    .service('storageSvc', storageSvc);

function storageSvc() {

    var self = this;

    self.getLocal = function(key) {
        var item = localStorage.getItem(key);
        return (item ? JSON.parse(item) : null);
    };

    self.setLocal = function(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
        return self;
    };

}
