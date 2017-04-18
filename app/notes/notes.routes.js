(function() {
    angular
    	.module('app.notes')
    	.run(run);

    run.$inject = ['routerHelper'];

    /* @ngInject */
    function run(routerHelper) {
    	let states = [
    		{
    			state: 'app.notes',
    			config: {
    				url: '/notes',
    				params: {
    					title: 'Notes'
    				},
    				views: {
    					'container@' : {
    						component: 'notes'
    					}
    				}
    			}
    		}
    	];

    	routerHelper.configureStates(states);
    }
})();
