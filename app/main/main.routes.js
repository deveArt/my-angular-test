(function() {
    angular
    	.module('app.main')
    	.run(run);

    run.$inject = ['routerHelper'];

    /* @ngInject */
    function run(routerHelper) {
    	let states = [
    		{
    			state: 'app.main',
    			config: {
    				url: '/',
    				params: {
    					title: 'Home'
    				},
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
})();
