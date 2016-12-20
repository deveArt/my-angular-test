var injectParams = ['$q', '$http'];

var authService = function ($q, $http) {
    var options = {
        method: 'POST',
        url: 'http://localhost:3000/auth/login',
        //'http://dcodeit.net/teletherapy_valeriy/public/api/auth/login',
        //http://dcodeit.net/tendermasterweb/public/api/login
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
    };

    this.login = function (data) {
        options.data = data;
        return $http(options);
    };

};

authService.$inject = injectParams;
angular.module('app').service('authSvc', authService);
