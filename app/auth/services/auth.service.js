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

    this.login = login;
    this.logout = logout;
    this.registrate = registrate;

    function login(data) {
        options.url = url + 'login';
        options.data = data;
        return $http(options);
    }

    function logout() {
        options.url = url + 'logout';
        return $http(options);
    }

    function registrate() {
        return $timeout(1000);
    }
}
