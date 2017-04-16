angular
	.module('app.auth')
	.run(authRun);

authRun.$inject = ['routerHelper'];
/* @ngInject */
function authRun(routerHelper) {
	let states = [
		{
			state: 'app.login',
			config: {
				url: '/login',
				params: {
					title: 'Login'
				},
				views: {
					'container@' : {
						//	component: 'main'
						template: 'huiiiiirfrfef'
					}
				}
			}
		},
		{
			state: 'app.registration',
			config: {
				url: '/registration',
				params: {
					title: 'Registration'
				},
				views: {
					'container@' : {
						//	component: 'main'
						template: 'regggssdgdsgsdfg'
					}
				}
			}
		}
	];

	routerHelper.configureStates(states);
}
