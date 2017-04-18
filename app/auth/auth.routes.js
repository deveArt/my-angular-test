(function() {
    angular
    	.module('app.auth')
    	.run(run);

    run.$inject = ['routerHelper'];
    /* @ngInject */
    function run(routerHelper) {
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
    						component: 'login'
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
    						component: 'registration'
    					}
    				}
    			}
    		}
    	];

    	routerHelper.configureStates(states);
    }

})();
