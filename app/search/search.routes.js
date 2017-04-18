(function() {
    angular
    	.module('app.search')
    	.run(run);

    run.$inject = ['routerHelper'];

    /* @ngInject */
    function run(routerHelper) {
    	let states = [
    		{
    			state: 'app.search',
    			config: {
    				url: '/search',
    				params: {
    					title: 'Search'
    				},
    				views: {
    					'container@' : {
    						component: 'search'
    					}
    				}
    			}
    		}
    	];

    	routerHelper.configureStates(states);
    }

})();
