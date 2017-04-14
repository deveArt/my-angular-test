angular
	.module('app.main')
	.run(mainRun);

mainRun.$inject = ['routerHelper'];
/* @ngInject */
function mainRun(routerHelper) {
	routerHelper.configureStates(getStates());

	function getStates() {
		return [
			{
				state: 'app.main',
				config: {
					component: 'main',
					url: '/'
				},
				views: {
					'container@' : {}
				}
			}
		];
	}
}
