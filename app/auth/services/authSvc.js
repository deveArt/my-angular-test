var injectParams = ['$http', '$timeout'];

var authService = function ($http, $timeout) {
    const url = 'http://dcodeit.net/tendermasterweb/public/api/';

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
    };

    this.login = function (data) {
        options.url = url + 'login';
        options.data = data;
        return $http(options);
    };

    this.logout = function () {
        options.url = url + 'logout';
        return $http(options);
    };
    
    this.registrate = function () {
        return $timeout(1000);
    };
};

authService.$inject = injectParams;
angular.module('app').service('authSvc', authService);
