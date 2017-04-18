(function() {
    angular
    	.module('app.users')
    	.run(run);

    run.$inject = ['routerHelper'];

    /* @ngInject */
    function run(routerHelper) {
    	let states = [
    		{
    			state: 'app.users',
    			config: {
    				url: '/users/{userId:int}',
    				params: {
    					title: 'Users',
                        userId: {
                            value: null,
                            squash: true // param is optional
                        }
    				},
    				views: {
    					'container@' : {
    						component: 'users'
    					}
    				}
    			}
    		}
    	];

    	routerHelper.configureStates(states);
    }
})();
