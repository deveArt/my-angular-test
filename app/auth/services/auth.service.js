angular
    .module('app.auth')
    .service('authService', authService);

authService.$inject = ['$http', '$timeout'];
function authService($http, $timeout) {
    const url = 'http://dcodeit.net/tendermasterweb/public/api/';

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
            let str = [];
            for (let p in obj)
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
}

