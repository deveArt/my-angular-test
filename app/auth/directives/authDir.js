angular
    .module('app')
    .directive('username',function($http,$q){
    return{
      require:'ngModel',
      link:function($scope,element,attrs,ngModel){
        ngModel.$asyncValidators.userAvailable = function(modelValue , viewValue) {

         var userInput= modelValue || viewValue;
          return $http.post('/user'+userInput)
             .then(function() {
               //username exists, this means validation success
               return true;
             }, function() {
               //username does not exist, therefore this validation fails
               return $q.reject('selected username does not exists');
             });

          }
        }
      }
    });
