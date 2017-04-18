(function() {
    angular
    	.module('app.translations')
    	.run(run);

    run.$inject = ['routerHelper'];

    /* @ngInject */
    function run(routerHelper) {
    	let states = [
    		{
    			state: 'app.translations',
    			config: {
    				url: '/translations',
    				params: {
    					title: 'Translations'
    				},
    				views: {
    					'container@' : {
    						component: 'translations'
    					}
    				}
    			}
    		}
    	];

    	routerHelper.configureStates(states);
    }

})();
