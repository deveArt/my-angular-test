angular
	.module('app.router')
	.provider('routerHelper', routerHelperProvider);

routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
/* @ngInject */
function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
	/* jshint validthis:true */
	this.$get = RouterHelper;

	$locationProvider.html5Mode(true);

	RouterHelper.$inject = ['$state'];
	/* @ngInject */
	function RouterHelper($state) {
		var hasOtherwise = false;

		return {
			configureStates: configureStates,
			getStates: getStates
		};

		function configureStates(states, otherwisePath) {console.log(states);
			states.forEach(function(currentState) {
				$stateProvider.state(currentState.state, currentState.config);
			});
			if (otherwisePath && !hasOtherwise) {
				hasOtherwise = true;
				$urlRouterProvider.otherwise(otherwisePath);
			}
		}

		function getStates() {
			return $state.get();
		}
	}
}
