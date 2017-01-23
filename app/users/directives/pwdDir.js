angular
    .module('app')
    .directive('pwdDir', pwdDir);

function pwdDir() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            var me = attrs.ngModel;
            var matchTo = attrs.pwdDir;

            scope.$watchGroup([me, matchTo], function(value) {
                ctrl.$setValidity('pwdmatch', value[0] === value[1]);
            });

        }
    };
}
