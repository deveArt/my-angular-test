angular
	.module('app.auth')
	.run(authRun);

authRun.$inject = ['routerHelper'];
/* @ngInject */
function authRun(routerHelper) {
	routerHelper.configureStates(getStates());

	function getStates() {
		return [
			{
				state: 'app.login',
				config: {
					component: 'login',
					url: '/login'
				},
				views: {
					'container@' : {}
				}
			},
			{
				state: 'app.registration',
				config: {
					component: 'registration',
					url: '/registration'
				},
				views: {
					'container@' : {}
				}
			}
		];
	}
}
