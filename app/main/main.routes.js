angular
	.module('app.main')
	.run(mainRun);

mainRun.$inject = ['routerHelper'];

/* @ngInject */
function mainRun(routerHelper) {
	let states = [
		{
			state: 'app.main',
			config: {
				url: '/',
				views: {
					'container@' : {
						component: 'main'
					}
				}
			}
		}
	];

	routerHelper.configureStates(states);
}
