'use strict';
angular
    .module('app', [
        /* shared module */
        'app.common',
        /* feature modules */
        'app.main',
        'app.auth',
        'app.search',
        'app.translations',
        'app.users',
        'app.notes'
    ]);

angular
    .module('app.auth', [
      'app.common'
    ]);

angular
    .module('app.common', [
        'ui.router',
        'app.router',
        'ngCookies',
        'ngMessages'
    ])
    .run(commonInit);

commonInit.$inject = ['globalVars'];
function commonInit(globalVars) {
    globalVars.setVar('color', 'success');
}

angular
    .module('app.main', [
      'app.common'
    ]);

angular
    .module('app.notes', [
      'app.common'
    ]);

angular
    .module('app.router', []);

angular
    .module('app.search', [
      'app.common'
    ]);

angular
    .module('app.translations', [
      'app.common'
    ]);

angular
    .module('app.users', [
      'app.common'
    ]);

angular
    .module('app')
    .config(config);

config.$inject = ['$locationProvider', '$httpProvider', '$stateProvider'];
function config($locationProvider, $httpProvider, $stateProvider) {

    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            views: {
                'header': {
                    component: 'navBar'
                },
                'footer': {
                    template: '2017'
                }
            }
        });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}

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

angular
    .module('app.main')
    .component('main', {
        controller: MainController,
        templateUrl: '/app/main/main.component.tmpl.html'
    });

MainController.$inject = ['globalVars'];
function MainController(globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;

}

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

angular
    .module('app.notes')
    .component('notes', {
        controller: NotesController,
        templateUrl: '/app/notes/notes.component.tmpl.html'
    });

NotesController.$inject = ['$scope', '$compile', 'geometryService', 'globalVars'];
function NotesController($scope, $compile, geometryService, globalVars) {

	var $ctrl = this;

	const ncount_max = 10;
	$ctrl.globalVars = globalVars.data;
	$ctrl.ncount = 0;
	$ctrl.number = 0;
	$ctrl.text = '';
	$ctrl.dragScope = {};
	$ctrl.resizeMode = false;

	$ctrl.addNote = addNote;
	$ctrl.makeResizable = makeResizable;
	$ctrl.removeResizable = removeResizable;
	$ctrl.resizeRefresh = resizeRefresh;
    $ctrl.toggleResize = toggleResize;

    function makeResizable() {

        let elems = angular.element(document.querySelectorAll(':not(resizable) > dnd-element'));

        angular.forEach(elems, function (domEl, key) {
            let _el = domEl;
            let el = angular.element(domEl);

            if (_el.parentNode.mode !== 'drop') {
                return;
            }

            let dragZone = el.parent();
            let resizeEl = angular.element(
                '<resizable>' +
                '</resizable>'
            );

            let position = geometryService.getCoords(_el);

            let newEl = el.clone();
            dragZone.append(resizeEl);
            resizeEl.css({
                position: el.css('position'),
                left: el.css('left'),
                top: el.css('top'),
                zIndex: el.css('z-index'),
                width: position.width + 'px',
                height: position.height + 'px'
            });

            el.remove();

            newEl.prop('style', null);
            newEl.css({
                width: position.width + 'px',
                height: position.height + 'px'
            });

            resizeEl.append(newEl);

            let newScope = $scope.$new(true);
            $compile(resizeEl)(newScope);

            resizeEl.on('$destroy', function () {
                newScope.$destroy();
            });

        });

    }

    function removeResizable() {

        let elems = angular.element(document).find('resizable');

        angular.forEach(elems, function (domEl, key) {
            let el = angular.element(domEl);
            let dragZone = el.parent();

            let _dndEl = el.find('dnd-element');

            el.remove();

            if ( _dndEl.length > 0 ) {
                let elCss = {
                    position: el.css('position'),
                    left: el.css('left'),
                    top: el.css('top'),
                    zIndex: el.css('z-index'),
                    width: _dndEl.css('width'),
                    height: _dndEl.css('height')
                };

                let dndEl = _dndEl.clone();
                dndEl.css(elCss);

                dragZone.append(dndEl);

                let newScope = $scope.$new(true);
                $compile(dndEl)(newScope);

                dndEl.on('$destroy', function () {
                    newScope.$destroy();
                });
            }

        });
    }

    function resizeRefresh() {

		if (!$ctrl.resizeMode) {
			return;
		}

		let elems = angular.element(document.querySelectorAll('resizable:empty'));
		elems.remove();

		$ctrl.makeResizable();

	}

    function toggleResize() {
        if ($ctrl.resizeMode) {
            $ctrl.removeResizable();
            $ctrl.resizeMode = false;
        } else {
            $ctrl.makeResizable();
            $ctrl.resizeMode = true;
        }
    }

    function addNote() {

		$ctrl.ncount = angular.element(document).find('dnd-element').length;
		if (!$ctrl.noteForm.$valid || $ctrl.ncount >= ncount_max) {
			return false;
		}

		$ctrl.number ++;
		let subject = 'Note #'+ $ctrl.number;
		let dragZone = document.getElementById('dragZone');
		let dragEl = angular.element(
			'<dnd-element>' +
				'<p><b>'+subject+'</b></p>' +
				'<p>'+$ctrl.text+'</p>' +
			'</dnd-element>'
		);

		angular.element(dragZone).append(dragEl);

		let newScope = $scope.$new(true);
		$compile(dragEl)(newScope);

		dragEl.on('$destroy', function () {
			newScope.$destroy();
		});

		$ctrl.text = '';
		$ctrl.noteForm.$setPristine();
	}
}

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

angular
	.module('app.router')
	.provider('routerHelper', routerHelperProvider);

routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
/* @ngInject */
function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
	/* jshint validthis:true */
	this.$get = RouterHelper;

	$locationProvider.html5Mode(true);

	RouterHelper.$inject = ['$state'];
	/* @ngInject */
	function RouterHelper($state) {
		let hasOtherwise = false;

		return {
			configureStates: configureStates,
			getStates: getStates
		};

		function configureStates(states, otherwisePath) {console.log(states);
			states.forEach(function(currentState) {
				$stateProvider.state(currentState.state, currentState.config);
			});
			if (otherwisePath && !hasOtherwise) {
				hasOtherwise = true;
				$urlRouterProvider.otherwise(otherwisePath);
			}
		}

		function getStates() {
			return $state.get();
		}
	}
}

angular
    .module('app.search')
    .component('search', {
        controller: SearchController,
        templateUrl: '/app/search/search.component.tmpl.html'
    });

SearchController.$inject = ['$http', 'globalVars'];
function SearchController($http, globalVars) {

    const listUrl = 'http://dcodeit.net/angularTest/data.json';

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = [];
    $ctrl.searchWord = '';
    $ctrl.curFields = {
        Name: false,
        Type: false,
        'Designed by': false
    };
    $ctrl.insens = true;
    $ctrl.exact = false;
    init();

    function init() {
        $http.get(listUrl).then(function (response) {
            $ctrl.data = response.data;
        }).catch(function (err) {
            console.error(err);
        });
    }
}

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

angular
    .module('app.translations')
    .component('translations', {
        controller: TranslationsController,
        templateUrl: '/app/translations/translations.component.tmpl.html'
    });

TranslationsController.$inject = ['translationService', 'globalVars'];
function TranslationsController(translationService, globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.curLang = 'eng';
    $ctrl.pageWords = {};
    $ctrl.switch = switchLang;

    init();

    function init() {
        translationService.getLangs().then(function (langs) {
            $ctrl.langs = langs;
        }).catch(function (err) {
            console.log(err);
        });

        $ctrl.switch();
    }

    function switchLang() {
        $ctrl.pageWords = translationService.getLocal($ctrl.curLang);
        if ($ctrl.pageWords === null) {
            translationService.load($ctrl.curLang).then(function (data) {
                $ctrl.pageWords = data;
            })
            .catch(function (err) {
                console.log(err);
            });
        }
    }

}

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

angular
    .module('app.users')
    .component('users', {
        controller: UsersController,
        templateUrl: '/app/users/users.component.tmpl.html'
    });

UsersController.$inject = ['storageService', '$stateParams', '$state', 'globalVars'];
function UsersController(storageService, $stateParams, $state, globalVars) {

    let defaultUsers = [
        {
            username: 'Sam',
            email: 'samuel33@gmail.com',
            country: 'USA',
            password: '!@123Aaaa',
        },
        {
            username: 'Rick',
            email: 'rickmiller@gmail.com',
            country: 'USA',
            password: '!@123Aaaa',
        },
        {
            username: 'Linda',
            email: 'papapa4141@gmail.com',
            country: 'Canada',
            password: '!@123Aaaa',
        }
    ];

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = {};
    $ctrl.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;
    $ctrl.submit = submit;
    $ctrl.userId = null;
    $ctrl.selectUser = selectUser;

    init();

    function init() {
        $ctrl.users = storageService.getLocal('users');
        if (!$ctrl.users) {
            storageService.setLocal('users', defaultUsers);
            $ctrl.users = defaultUsers;
        }

        if ($stateParams.userId !== null) {
            $ctrl.userId = $stateParams.userId;
            $ctrl.data = angular.copy($ctrl.users[$stateParams.userId]);
        }
    }

    function submit(userId) {
        if (userId) {
            edit(userId);
        } else {
            add();
        }

        $ctrl.usersForm.$setPristine();
        storageService.setLocal('users', $ctrl.users);
    }

    function add() {
        $ctrl.users.push($ctrl.data);
        $ctrl.data = {};
    }

    function selectUser(userId) {
        $state.go($state.current.name, {'userId': userId});
    }

    function edit(userId) {
        $ctrl.data.password = $ctrl.data.newpassword;
        $ctrl.data.newpassword = $ctrl.data.newpasswordrepeat = null;

        $ctrl.users[userId] = angular.copy($ctrl.data);
    }
}

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

angular
    .module('app.auth')
    .component('login', {
        controller: LoginController,
        templateUrl: '/app/auth/login/login.component.tmpl.html'
    });

LoginController.$inject = ['authService', '$cookies', '$location', 'globalVars'];
function LoginController(authService, $cookies, $location, globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = {};
    $ctrl.data.rememberMe = true;

    $ctrl.submit = submit;

    function submit() {

        authService.login($ctrl.data).then(function (response) {

            $ctrl.formErrors = response.data.errors || {};

            if (!response.data.errors) {
                console.log($cookies.getAll());
                globalVars.setVar('loggedIn', true);
                $location.path("/translations");
            }

            for (let i in $ctrl.loginForm.$$controls) {
                let control = $ctrl.loginForm.$$controls[i];

                if ($ctrl.formErrors[control.$name]) {
                    control.$setValidity(control.$name, false);
                } else {
                    control.$setValidity(control.$name, true);
                }
            }

        }).catch(function (error) {
            console.error(error);
        });
    }
}

angular.module('app.auth')
    .component('registration', {
        controller: RegistrationController,
        templateUrl: '/app/auth/registration/registration.component.tmpl.html'
    });

RegistrationController.$inject = ['authService', 'globalVars'];
function RegistrationController(authService, globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = {};
    $ctrl.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;

    $ctrl.submit = submit;

    function submit() {
        console.log('valid');
        authService.registrate($ctrl.data).then(function (response) {
            console.log('ok');
        }).catch(function (error) {
            console.error(error);
        });
    }
}

angular
    .module('app.auth')
    .service('authService', authService);

authService.$inject = ['$http', '$timeout'];
function authService($http, $timeout) {
    const url = 'http://dcodeit.net/tendermasterweb/public/api/';

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
            let str = [];
            for (let p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
    };

    this.login = login;
    this.logout = logout;
    this.registrate = registrate;

    function login(data) {
        options.url = url + 'login';
        options.data = data;
        return $http(options);
    }

    function logout() {
        options.url = url + 'logout';
        return $http(options);
    }

    function registrate() {
        return $timeout(1000);
    }
}

/**
 * Provides a way to capture whenever a click happens outside of an element (even if the element has no blur event). Due
 * to performance optimization, this DOES NOT run an $apply after the onClickOut handler unless you return true. e.g.
 *
 *      <my-click-out ng-if="editMode" on-click-out="finishEditing()" selector=".task-edit"></my-click-out>
 *
 * @binding selector The string of what does not trigger the click out. This can be any valid jQuery selector and can
 *                   specify multiple elements.
 * @binding onClickOut This i   s called when the element is no longer clicked on. Return true to do a $apply. But do so
 *                     carefully because $apply are very expensive and can have large performance penalties when there
 *                     are lots of other clickouts. For example, in grids.
 */
angular
    .module('app.common')
    .component('myClickOut', {
        controller: MyClickOutController,
        bindings: {
            selectors: '<',
            onClickOut: '&'
        }
    });

MyClickOutController.$inject = ['$window', '$element', '$scope'];
function MyClickOutController($window, $element, $scope) {
    var $ctrl = this;

    $ctrl.$postLink = $postLink;

    function $postLink() {

        document.onmousedown = checkIfClickOutsideSelectionArea;
        angular.element($window).on('blur' ,checkIfClickOutsideSelectionArea);
        // There is no point in listening for click outs when the element is no longer used by Angular.
        $scope.$on('$destroy', function () {
            document.onmousedown = null;
            angular.element($window).unbind('blur', checkIfClickOutsideSelectionArea);
        });
    }

    /**
     * Get the real absolute element position. Offset based methods, including those with offsetParent included are
     * buggy. This gets the bounding rectangle position of an element in the current viewport then adds the scroll.
     * Finally, the body borders are subtracted just in case.
     *
     * @param  {Object} ele The raw DOM element.
     *
     * @return {Object} Contains the top and left properties of an element for the entire page.
     */
    function getAbsoluteTopLeft(ele) {
        let box = ele.getBoundingClientRect();

        // Math.round because it is actually possible to get fractional pixels.
        return {
            top: Math.round(box.top +  window.pageYOffset - document.body.clientTop),
            left: Math.round(box.left + window.pageXOffset - document.body.clientLeft)
        };
    }

    /**
     * Point collision detection (is the mouse in the element?).
     *
     * @param  {Object} ele The Angular element to check for if the mouse is in
     * @param  {Object} pointer The jQuery Event obje   ct which gives the mouse pointer position.
     *
     * @return {Boolean} If the pointer is in the given element.
     */
    function collisionOnPoint(ele, pointer) {
        let bounds = getAbsoluteTopLeft(ele),
            leftEdge = bounds.left,
            topEdge = bounds.top,
            bottomEdge = topEdge + ele.offsetHeight,
            rightEdge = leftEdge + ele.offsetWidth;

        return pointer.pageX >= leftEdge && pointer.pageX <= rightEdge &&
            pointer.pageY >= topEdge && pointer.pageY <= bottomEdge;
    }

    /**
     * Call the bound clickOut method. If it returns true, do a $apply in this scope.
     */
    function doClickOut() {
        if ($ctrl.onClickOut()) {
            $scope.$apply();
        }
    }

    /**
     * Checks if the selection is outside of the selection area in 2 steps. If any of the steps succeed, the
     * clickout is fired and the other steps are not visited:
     * 1. If the container cannot be found
     * 2. If the container can be found check if the mouse is in the element
     * 3. If the mouse is not in the element, check if the target element is the element or is a child of it. Some
     *    elements have no height, so this 3rd step is necessary.
     * This algorithm assumes that clickout events are very frequent as most elements do not cover much of the
     * screen. So non-clickouts are computationally expensive instead.
     *
     * @param  {Object} e The event from the browser
     *
     * @return {undefined}
     */
    function checkIfClickOutsideSelectionArea(e) {
        if( typeof $ctrl.selectors === 'string' ) {
            $ctrl.selectors = [ $ctrl.selectors ];
        }

        let container = [];
        $ctrl.selectors.forEach(function (sel) {
            let match = $element.parent().find(sel);

            angular.forEach(match, function (subEl) {
                container.push(subEl);
            });

        });

        if (container.length === 0) {
            doClickOut();
            return null;
        }

        let res = [];
        container.forEach(function (el) {
            res.push(collisionOnPoint(el, e));
        });

        if (res.some(function (val) {
            return val === true;
        })) {
            return null;
        }

        doClickOut();
    }
}

angular
    .module('app.common')
    .component('dndElement', {
        controller: DndElementController,
        require: {
            dndZone: '^^dndZone'
        }
    });

DndElementController.$inject = ['$element'];

function DndElementController($element) {
    var $ctrl = this;

    $ctrl.$onInit = init;

    function init() {

        $element.on('mousedown', onMouseDown);

        function onMouseDown(e) {
            if (e.which != 1) { // не левой кнопкой
                return false;
            }

            $ctrl.dndZone.dragTarget = {
                dragElement: $element,
                startX: e.pageX,
                startY: e.pageY
            };

        }
    }
}

angular
    .module('app.common')
    .component('dndZone', {
        controller: DndZoneController,
        bindings: {
            mode: '@',
            onStart: '&',
            onEnd: '&'
        }
    });

DndZoneController.$inject = ['$document', '$element', 'geometryService'];

/**
 *
 * Dnd zone controller
 * dnd flow manage
 *
 * @constructor
 */
function DndZoneController($document, $element, geometryService) {
    var $ctrl = this;
    $ctrl.dragTarget = null;
    $ctrl._elem = null;

    $ctrl.$postLink = init;

	/**
     * Main setup listeners
     */
    function init() {
        $element[0].mode = $ctrl.mode;

        if ($ctrl.mode !== 'drag') {
            $element.on('dropready', function (e) {
                $element.css({'background-color': '#27ae60'});
                console.log('ready to drop');
            });
            $element.on('dragleave', function (e) {
                $element.css({'background-color': null});
                console.log('drag el left');
            });
        }

        $document.on('mousemove', onMouseMove);
        $document.on('mouseup', onMouseUp);

        function onMouseMove(e) {
            if (!$ctrl.dragTarget) {
                return;
            }

            if (Math.abs(e.pageX - $ctrl.startX) < 3 && Math.abs(e.pageY - $ctrl.startY) < 3) {
                return;
            }

            if ( $ctrl._elem === null ) {
                $ctrl.onStart && $ctrl.onStart();
                dragStart();
            }

            onDragMove(e);

            let newDropTarget = findDropTarget();

            if (newDropTarget != $ctrl._dropTarget) {
                $ctrl._dropTarget && angular.element($ctrl._dropTarget).triggerHandler('dragleave');
                newDropTarget && angular.element(newDropTarget).triggerHandler('dropready');
            }

            $ctrl._dropTarget = newDropTarget;
        }

        function onMouseUp(e) {

            if (e.which != 1) { // не левой кнопкой
                return false;
            }
            if (!$ctrl.dragTarget) {
                return;
            }

            if ($ctrl._elem) {
                console.log($ctrl._dropTarget);
                if ($ctrl._dropTarget) {
                    dragEnd();
                } else {
                    rollBack();
                }
            }

            $ctrl.dragTarget = null;
            $ctrl._elem = null;
            $ctrl._dropTarget = null;
            $ctrl.old = null;
        }
    }

    /**
    * Revert move actions
    *
    **/
    function rollBack() {
        console.log('rollback');

        $ctrl.old.parent.insertBefore($ctrl._elem, $ctrl.old.nextSibling);

        let coords = geometryService.getCoords($ctrl.old.parent);
        $ctrl._elem.style.position = $ctrl.old.position;
        $ctrl._elem.style.left = $ctrl.old.left - coords.left - $ctrl._margin + 'px';
        $ctrl._elem.style.top = $ctrl.old.top - coords.top - $ctrl._margin + 'px';
        $ctrl._elem.style.zIndex = $ctrl.old.zIndex;

        $ctrl.onEnd && $ctrl.onEnd();
    }

    /**
    * End of drag action. Append to target zone. Position adjustment.
    *
    **/
    function dragEnd() {
        if ($ctrl._dropTarget == null) {
            return null;
        }
        console.log('drag end');
        angular.element($ctrl._dropTarget).triggerHandler('dragleave');

        if ($ctrl._dropTarget.mode === 'trash') {
            angular.element($ctrl._elem).remove();
        } else {
            let coordsEl = geometryService.getCoords($ctrl._elem);
            let coordsZone = geometryService.getCoords($ctrl._dropTarget);
            let diffLeft = coordsZone.left - coordsEl.left + 10;
            let diffTop = coordsZone.top - coordsEl.top + 10;
            let diffRight = coordsZone.right - coordsEl.right - 10;
            let diffBottom = coordsZone.bottom - coordsEl.bottom - 10;

            let left = $ctrl._elemX - coordsZone.left - $ctrl._margin;
            let top = $ctrl._elemY - coordsZone.top - $ctrl._margin;

            if (coordsZone.left > coordsEl.left) {
                left += diffLeft;
            }

            if (coordsZone.top > coordsEl.top) {
                top += diffTop;
            }

            if (coordsZone.bottom < coordsEl.bottom) {
                top += diffBottom;
            }

            if (coordsZone.right < coordsEl.right) {
                left += diffRight;
            }

            $ctrl._dropTarget.appendChild($ctrl._elem);
            $ctrl._elem.style.left = left + 'px';
            $ctrl._elem.style.top = top + 'px';
        }

        $ctrl.onEnd && $ctrl.onEnd();
    }

    /**
    * Start drag. Save old position. Move element to body scope.
    *
    **/
    function dragStart() {
        if (!$ctrl.dragTarget) {
            return;
        }
        console.log('drag start');

        // создать вспомогательные свойства shiftX/shiftY
        $ctrl._elem = $ctrl.dragTarget.dragElement[0];
        $ctrl._margin = parseInt(getComputedStyle($ctrl._elem, null).getPropertyValue('margin'));

        let coords = geometryService.getCoords($ctrl._elem);
        $ctrl._shiftX = $ctrl.dragTarget.startX - coords.left;
        $ctrl._shiftY = $ctrl.dragTarget.startY - coords.top;

        $ctrl.old = {
            parent: $ctrl._elem.parentNode,
            nextSibling: $ctrl._elem.nextSibling,
            position: $ctrl._elem.style.position || '',
            left: coords.left || '',
            top: coords.top || '',
            zIndex: $ctrl._elem.style.zIndex || ''
        };

        document.body.appendChild($ctrl._elem);
        $ctrl._elem.style.zIndex = 20;
        $ctrl._elem.style.position = 'absolute';

        return true;
    }

    /**
    * Move element following the cursor
    *
    **/
    function onDragMove(event) {

        $ctrl._elemX = event.pageX - $ctrl._shiftX;
        $ctrl._elemY = event.pageY - $ctrl._shiftY;

        $ctrl._elem.style.left = $ctrl._elemX
            - $ctrl._margin
            + 'px';
        $ctrl._elem.style.top = $ctrl._elemY
            - $ctrl._margin
            + 'px';

        $ctrl._currentTargetElem = geometryService.getElementUnderClientXY($ctrl._elem, event.clientX, event.clientY);
    }

    /**
    * Find drop zone
    *
    **/
    function findDropTarget() {
        if (!$ctrl._currentTargetElem) {
            return null;
        }

        let elem = $ctrl._currentTargetElem;

        while (elem != document && elem.mode !== 'drop' && elem.mode !== 'trash') {
            elem = elem.parentNode;
        }

        if (elem == document) {
            return null;
        }

        return elem;
    }
}

angular
    .module('app.common')
    .filter('searchFilter', searchFilter);

function searchFilter() {
    return function (items, searchWord, curFields, insens, exact) {console.log(curFields);
        return items.filter(function (item) {

            let swEscaped = searchWord.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            let regex = new RegExp(exact? '^'+swEscaped+'$': swEscaped, insens? 'i': '');

            if (!angular.equals({Name: false, Type: false, 'Designed by': false}, curFields)) {

                let matches = [];
                for(let field in curFields) {
                    if (curFields[field]) {
                        matches.push(regex.test(item[field]));
                    }
                }

                return matches.some(function (match) {
                    return match === true;
                });
            }

            return regex.test(item.Name) || regex.test(item.Type) || regex.test(item['Designed by']);
        });
    };
}

angular
    .module('app.common')
    .component('passwordConfirm', {
        templateUrl: '/app/common/password-confirm/password-confirm.component.tmpl.html',
        controller: passwordConfirmController,
        bindings: {
            password: '<'
        }
    });

function passwordConfirmController() {
    var $ctrl = this;

    $ctrl.$onChanges = check;

    function check() {
        if (!$ctrl.passwordConfirmForm) {
            return;
        }

        $ctrl.passwordConfirmForm.newpasswordrepeat.$setValidity('match', $ctrl.password === $ctrl.passwordConfirm);
    }
}

angular
    .module('app')
    .directive('pwdDir', pwdDir);

function pwdDir() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            let me = attrs.ngModel;
            let matchTo = attrs.pwdDir;

            scope.$watchGroup([me, matchTo], function(value) {
                ctrl.$setValidity('pwdmatch', value[0] === value[1]);
            });

        }
    };
}

angular
    .module('app.common')
    .component('navBar', {
        templateUrl: '/app/common/nav-bar/nav-bar.component.tmpl.html',
        controller: NavbarController,
        bindings: {
            location: '<'
        }
    });

NavbarController.$inject = ['$state', 'globalVars', 'authService', '$cookies'];

function NavbarController($state, globalVars, authService, $cookies) {
    var $ctrl = this;

    $ctrl.states = $state.get().filter(state => !state.abstract);
    $ctrl.isActive = isActive;
    $ctrl.goTo = goTo;
    $ctrl.globalVars = globalVars.data;

    function goTo(state) {
        return $state.go(state);
    }

    function isActive(state) {
        return $state.includes(state);
    }

    $ctrl.logout = logout;

    function logout() {
        authService.logout().then(function (response) {
            if (!response.data.errors) {
                //console.log($cookies);
                globalVars.setVar('loggedIn', false);
                goTo("app.login");
            }

            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
}

angular
    .module('app.common')
    .component('resizable', {
        controller: ResizableController
    });

ResizableController.$inject = ['$element', '$document', 'geometryService'];

/**
 * Resize controller
 *
 * @constructor
 */
function ResizableController($element, $document, geometryService) {
    var $ctrl = this;

    $ctrl.$postLink = init;
    $ctrl.active = false;

    function init() {
        $ctrl._elem = $element.children()[0];
        $ctrl.$elem = angular.element($ctrl._elem);

        $element.on('mouseenter', function (e) {
            showControls(e);
        });

        $element.on('mouseleave mousedown', function (e) {
            removeControls();
        });

        $document.on('mousemove', function (e) {
            if (!$ctrl.active || !$ctrl._elem) {
                return;
            }

            let css = {
                width: e.pageX + $ctrl.stWidth - $ctrl.cornerSX + 'px',
                height: e.pageY + $ctrl.stHeight - $ctrl.cornerSY + 'px'
            };

            $ctrl.$elem.css(css);
            $element.css(css);
        });

        $document.on('mouseup', function (e) {
            removeControls();
            $ctrl.active = false;
        });
    }

	/**
     * Show resize controls
     *
     * @param e
     */
    function showControls(e) {

        let overlayElement = angular.element('<div class="resize-control" data-mode="resize-corner"></div>');

        overlayElement.on('mousedown', function (event) {
            $ctrl.active = true;

            let position = geometryService.getCoords($ctrl._elem);

            $ctrl.stWidth = position.width;
            $ctrl.stHeight = position.height;

            $ctrl.cornerSX = event.pageX;
            $ctrl.cornerSY = event.pageY;

            event.stopPropagation();
        });

        $element.append(overlayElement);

    }

	/**
     *
     * Remove resize controls
     */
    function removeControls() {
        let resizeElements = document.getElementsByClassName('resize-control');
        angular.element(resizeElements).remove();
    }

}

/**
 * Select with search functionality
 */

angular
    .module('app.common')
    .component('selectImproved', {
        templateUrl: '/app/common/select-improved/select-improved.component.tmpl.html',
        controller: SelectImprovedController,
        bindings: {
            selvalue: '@',
            list: '<'
        }
    });

SelectImprovedController.$inject = ['globalVars', '$scope'];

/**
 * Select improved controller
 *
 * @constructor
 */
function SelectImprovedController(globalVars, $scope) {
    var $ctrl = this;

    let themes = [
        {name: 'primary', val: 'Dark blue'},
        {name: 'success', val: 'Green'},
        {name: 'info', val: 'Blue'},
        {name: 'warning', val:'Yellow'},
        {name: 'danger', val: 'Red'},
        {name: 'grey', val: 'Grey'},
        {name: 'codeit', val:'CodeIT'},
        {name: 'dark-red', val: 'Dark red'}
    ];

    $ctrl.expand = false;
    $ctrl.$postLink = init;
    $ctrl.hide = hide;
    $ctrl.setVal = setVal;

    function init() {
        if (!$ctrl.list) {
          $ctrl.list = themes;
        }

        $ctrl.current = globalVars.getVar($ctrl.selvalue);
    }

    function hide() {
        $ctrl.expand = false;
        return true;
    }

    function setVal(val) {
        $ctrl.current = val;
        globalVars.setVar($ctrl.selvalue, val);
    }
}

angular
    .module('app.common')
    .service('geometryService', geometryService);

function geometryService() {

    this.getCoords = getCoords;
    this.getElementUnderClientXY = getElementUnderClientXY;

    /**
    * Get geometry values of the element
    *
    **/
    function getCoords(elem) {
        let box = elem.getBoundingClientRect();

        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;

        let top  = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        let right = box.right + scrollLeft - clientLeft;
        let bottom = box.bottom + scrollTop - clientTop;

        return {
            top: Math.round(top),
            left: Math.round(left),
            right: Math.round(right),
            bottom: Math.round(bottom),
            width: box.width,
            height: box.height
        };
    }

    /**
    * Find target under cursor
    *
    **/
    function getElementUnderClientXY(elem, clientX, clientY) {
        let display = elem.style.display || '';
        elem.style.display = 'none';

        let target = document.elementFromPoint(clientX, clientY);

        elem.style.display = display;

        if (!target || target == document) { // это бывает при выносе за границы окна
            target = document.body;
        }

        return target;
    }
}

angular
    .module('app.common')
    .service('globalVars', globalVars);

function globalVars() {

    let self = this;

    let vars = {};

    self.getVar = getVar;
    self.setVar = setVar;
    self.data = vars;

    function setVar(key, item) {
        vars[key] = item;
        return self;
    }

    function getVar(key) {
        return vars[key] !== undefined ? vars[key]: null;
    }

}

angular
    .module('app.common')
    .service('storageService', storageService);

function storageService() {

    let self = this;

    self.getLocal = getLocal;
    self.setLocal = setLocal;

    function getLocal(key) {
        let item = localStorage.getItem(key);
        return (item ? JSON.parse(item) : null);
    }

    function setLocal(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
        return self;
    }
}

angular
    .module('app.translations')
    .service('translationService', translationService);

translationService.$inject = ['$http', '$q', 'storageService'];
function translationService($http, $q, storageService) {

    let options = {
        method: 'GET',
        url: 'http://dcodeit.net/angularTest/translation.php'
    };

    let self = this;
    self.getLangs = getLangs;
    self.load = load;

    init();

    function init() {
        angular.extend(self, storageService);
    }

    function load(selectedLang) {
        options.params = {lang : selectedLang};

        return $http(options).then(function (response) {
            self.setLocal(selectedLang, response.data);
            return response.data;
        });
    }

    function getLangs() {
        let langs = ['eng', 'rus', 'de', 'no', 'it', 'sv'];

        return $q(function (resolve, reject) {
            resolve(langs);
        });
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhdXRoL2F1dGgubW9kdWxlLmpzIiwiY29tbW9uL2NvbW1vbi5tb2R1bGUuanMiLCJtYWluL21haW4ubW9kdWxlLmpzIiwibm90ZXMvbm90ZXMubW9kdWxlLmpzIiwicm91dGVyL3JvdXRlci5tb2R1bGUuanMiLCJzZWFyY2gvc2VhcmNoLm1vZHVsZS5qcyIsInRyYW5zbGF0aW9ucy90cmFuc2xhdGlvbnMubW9kdWxlLmpzIiwidXNlcnMvdXNlcnMubW9kdWxlLmpzIiwiYXBwLnJvdXRlci5qcyIsImF1dGgvYXV0aC5yb3V0ZXMuanMiLCJtYWluL21haW4uY29tcG9uZW50LmpzIiwibWFpbi9tYWluLnJvdXRlcy5qcyIsIm5vdGVzL25vdGVzLmNvbXBvbmVudC5qcyIsIm5vdGVzL25vdGVzLnJvdXRlcy5qcyIsInJvdXRlci9yb3V0ZXJIZWxwZXJQcm92aWRlci5qcyIsInNlYXJjaC9zZWFyY2guY29tcG9uZW50LmpzIiwic2VhcmNoL3NlYXJjaC5yb3V0ZXMuanMiLCJ0cmFuc2xhdGlvbnMvdHJhbnNsYXRpb25zLmNvbXBvbmVudC5qcyIsInRyYW5zbGF0aW9ucy90cmFuc2xhdGlvbnMucm91dGVzLmpzIiwidXNlcnMvdXNlcnMuY29tcG9uZW50LmpzIiwidXNlcnMvdXNlcnMucm91dGVzLmpzIiwiYXV0aC9sb2dpbi9sb2dpbi5jb21wb25lbnQuanMiLCJhdXRoL3JlZ2lzdHJhdGlvbi9yZWdpc3RyYXRpb24uY29tcG9uZW50LmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuanMiLCJjb21tb24vY2xpY2stb3V0L215LWNsaWNrLW91dC5jb21wb25lbnQuanMiLCJjb21tb24vZG5kL2RuZC1lbGVtZW50LmNvbXBvbmVudC5qcyIsImNvbW1vbi9kbmQvZG5kLXpvbmUuY29tcG9uZW50LmpzIiwiY29tbW9uL2ZpbHRlcnMvc2VhcmNoLmZpbHRlci5qcyIsImNvbW1vbi9wYXNzd29yZC1jb25maXJtL3Bhc3N3b3JkLWNvbmZpcm0uY29tcG9uZW50LmpzIiwiY29tbW9uL3Bhc3N3b3JkLWNvbmZpcm0vcHdkRGlyLmpzIiwiY29tbW9uL25hdi1iYXIvbmF2LWJhci5jb21wb25lbnQuanMiLCJjb21tb24vcmVzaXphYmxlL3Jlc2l6YWJsZS5jb21wb25lbnQuanMiLCJjb21tb24vc2VsZWN0LWltcHJvdmVkL3NlbGVjdC1pbXByb3ZlZC5jb21wb25lbnQuanMiLCJjb21tb24vc2VydmljZXMvZ2VvbWV0cnkuc2VydmljZS5qcyIsImNvbW1vbi9zZXJ2aWNlcy9nbG9iYWwtdmFycy5zZXJ2aWNlLmpzIiwiY29tbW9uL3NlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZS5qcyIsInRyYW5zbGF0aW9ucy9zZXJ2aWNlcy90cmFuc2xhdGlvbi5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJywgW1xuICAgICAgICAvKiBzaGFyZWQgbW9kdWxlICovXG4gICAgICAgICdhcHAuY29tbW9uJyxcbiAgICAgICAgLyogZmVhdHVyZSBtb2R1bGVzICovXG4gICAgICAgICdhcHAubWFpbicsXG4gICAgICAgICdhcHAuYXV0aCcsXG4gICAgICAgICdhcHAuc2VhcmNoJyxcbiAgICAgICAgJ2FwcC50cmFuc2xhdGlvbnMnLFxuICAgICAgICAnYXBwLnVzZXJzJyxcbiAgICAgICAgJ2FwcC5ub3RlcydcbiAgICBdKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuYXV0aCcsIFtcbiAgICAgICdhcHAuY29tbW9uJ1xuICAgIF0pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21tb24nLCBbXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAnYXBwLnJvdXRlcicsXG4gICAgICAgICduZ0Nvb2tpZXMnLFxuICAgICAgICAnbmdNZXNzYWdlcydcbiAgICBdKVxuICAgIC5ydW4oY29tbW9uSW5pdCk7XG5cbmNvbW1vbkluaXQuJGluamVjdCA9IFsnZ2xvYmFsVmFycyddO1xuZnVuY3Rpb24gY29tbW9uSW5pdChnbG9iYWxWYXJzKSB7XG4gICAgZ2xvYmFsVmFycy5zZXRWYXIoJ2NvbG9yJywgJ3N1Y2Nlc3MnKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAubWFpbicsIFtcbiAgICAgICdhcHAuY29tbW9uJ1xuICAgIF0pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ub3RlcycsIFtcbiAgICAgICdhcHAuY29tbW9uJ1xuICAgIF0pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5yb3V0ZXInLCBbXSk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnNlYXJjaCcsIFtcbiAgICAgICdhcHAuY29tbW9uJ1xuICAgIF0pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC50cmFuc2xhdGlvbnMnLCBbXG4gICAgICAnYXBwLmNvbW1vbidcbiAgICBdKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAudXNlcnMnLCBbXG4gICAgICAnYXBwLmNvbW1vbidcbiAgICBdKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoY29uZmlnKTtcblxuY29uZmlnLiRpbmplY3QgPSBbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRodHRwUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInXTtcbmZ1bmN0aW9uIGNvbmZpZygkbG9jYXRpb25Qcm92aWRlciwgJGh0dHBQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICduYXZCYXInXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnZm9vdGVyJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzIwMTcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XG4gICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcblxufVxuIiwiKGZ1bmN0aW9uKCkge1xuICAgIGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2FwcC5hdXRoJylcbiAgICBcdC5ydW4ocnVuKTtcblxuICAgIHJ1bi4kaW5qZWN0ID0gWydyb3V0ZXJIZWxwZXInXTtcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBydW4ocm91dGVySGVscGVyKSB7XG4gICAgXHRsZXQgc3RhdGVzID0gW1xuICAgIFx0XHR7XG4gICAgXHRcdFx0c3RhdGU6ICdhcHAubG9naW4nLFxuICAgIFx0XHRcdGNvbmZpZzoge1xuICAgIFx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcbiAgICBcdFx0XHRcdHBhcmFtczoge1xuICAgIFx0XHRcdFx0XHR0aXRsZTogJ0xvZ2luJ1xuICAgIFx0XHRcdFx0fSxcbiAgICBcdFx0XHRcdHZpZXdzOiB7XG4gICAgXHRcdFx0XHRcdCdjb250YWluZXJAJyA6IHtcbiAgICBcdFx0XHRcdFx0XHRjb21wb25lbnQ6ICdsb2dpbidcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH1cbiAgICBcdFx0fSxcbiAgICBcdFx0e1xuICAgIFx0XHRcdHN0YXRlOiAnYXBwLnJlZ2lzdHJhdGlvbicsXG4gICAgXHRcdFx0Y29uZmlnOiB7XG4gICAgXHRcdFx0XHR1cmw6ICcvcmVnaXN0cmF0aW9uJyxcbiAgICBcdFx0XHRcdHBhcmFtczoge1xuICAgIFx0XHRcdFx0XHR0aXRsZTogJ1JlZ2lzdHJhdGlvbidcbiAgICBcdFx0XHRcdH0sXG4gICAgXHRcdFx0XHR2aWV3czoge1xuICAgIFx0XHRcdFx0XHQnY29udGFpbmVyQCcgOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29tcG9uZW50OiAncmVnaXN0cmF0aW9uJ1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fVxuICAgIFx0XHR9XG4gICAgXHRdO1xuXG4gICAgXHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKHN0YXRlcyk7XG4gICAgfVxuXG59KSgpO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5tYWluJylcbiAgICAuY29tcG9uZW50KCdtYWluJywge1xuICAgICAgICBjb250cm9sbGVyOiBNYWluQ29udHJvbGxlcixcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL21haW4vbWFpbi5jb21wb25lbnQudG1wbC5odG1sJ1xuICAgIH0pO1xuXG5NYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWydnbG9iYWxWYXJzJ107XG5mdW5jdGlvbiBNYWluQ29udHJvbGxlcihnbG9iYWxWYXJzKSB7XG5cbiAgICB2YXIgJGN0cmwgPSB0aGlzO1xuXG4gICAgJGN0cmwuZ2xvYmFsVmFycyA9IGdsb2JhbFZhcnMuZGF0YTtcblxufVxuIiwiKGZ1bmN0aW9uKCkge1xuICAgIGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2FwcC5tYWluJylcbiAgICBcdC5ydW4ocnVuKTtcblxuICAgIHJ1bi4kaW5qZWN0ID0gWydyb3V0ZXJIZWxwZXInXTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIHJ1bihyb3V0ZXJIZWxwZXIpIHtcbiAgICBcdGxldCBzdGF0ZXMgPSBbXG4gICAgXHRcdHtcbiAgICBcdFx0XHRzdGF0ZTogJ2FwcC5tYWluJyxcbiAgICBcdFx0XHRjb25maWc6IHtcbiAgICBcdFx0XHRcdHVybDogJy8nLFxuICAgIFx0XHRcdFx0cGFyYW1zOiB7XG4gICAgXHRcdFx0XHRcdHRpdGxlOiAnSG9tZSdcbiAgICBcdFx0XHRcdH0sXG4gICAgXHRcdFx0XHR2aWV3czoge1xuICAgIFx0XHRcdFx0XHQnY29udGFpbmVyQCcgOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29tcG9uZW50OiAnbWFpbidcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XTtcblxuICAgIFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhzdGF0ZXMpO1xuICAgIH1cbn0pKCk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLm5vdGVzJylcbiAgICAuY29tcG9uZW50KCdub3RlcycsIHtcbiAgICAgICAgY29udHJvbGxlcjogTm90ZXNDb250cm9sbGVyLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAvbm90ZXMvbm90ZXMuY29tcG9uZW50LnRtcGwuaHRtbCdcbiAgICB9KTtcblxuTm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckY29tcGlsZScsICdnZW9tZXRyeVNlcnZpY2UnLCAnZ2xvYmFsVmFycyddO1xuZnVuY3Rpb24gTm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGNvbXBpbGUsIGdlb21ldHJ5U2VydmljZSwgZ2xvYmFsVmFycykge1xuXG5cdHZhciAkY3RybCA9IHRoaXM7XG5cblx0Y29uc3QgbmNvdW50X21heCA9IDEwO1xuXHQkY3RybC5nbG9iYWxWYXJzID0gZ2xvYmFsVmFycy5kYXRhO1xuXHQkY3RybC5uY291bnQgPSAwO1xuXHQkY3RybC5udW1iZXIgPSAwO1xuXHQkY3RybC50ZXh0ID0gJyc7XG5cdCRjdHJsLmRyYWdTY29wZSA9IHt9O1xuXHQkY3RybC5yZXNpemVNb2RlID0gZmFsc2U7XG5cblx0JGN0cmwuYWRkTm90ZSA9IGFkZE5vdGU7XG5cdCRjdHJsLm1ha2VSZXNpemFibGUgPSBtYWtlUmVzaXphYmxlO1xuXHQkY3RybC5yZW1vdmVSZXNpemFibGUgPSByZW1vdmVSZXNpemFibGU7XG5cdCRjdHJsLnJlc2l6ZVJlZnJlc2ggPSByZXNpemVSZWZyZXNoO1xuICAgICRjdHJsLnRvZ2dsZVJlc2l6ZSA9IHRvZ2dsZVJlc2l6ZTtcblxuICAgIGZ1bmN0aW9uIG1ha2VSZXNpemFibGUoKSB7XG5cbiAgICAgICAgbGV0IGVsZW1zID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJzpub3QocmVzaXphYmxlKSA+IGRuZC1lbGVtZW50JykpO1xuXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbGVtcywgZnVuY3Rpb24gKGRvbUVsLCBrZXkpIHtcbiAgICAgICAgICAgIGxldCBfZWwgPSBkb21FbDtcbiAgICAgICAgICAgIGxldCBlbCA9IGFuZ3VsYXIuZWxlbWVudChkb21FbCk7XG5cbiAgICAgICAgICAgIGlmIChfZWwucGFyZW50Tm9kZS5tb2RlICE9PSAnZHJvcCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBkcmFnWm9uZSA9IGVsLnBhcmVudCgpO1xuICAgICAgICAgICAgbGV0IHJlc2l6ZUVsID0gYW5ndWxhci5lbGVtZW50KFxuICAgICAgICAgICAgICAgICc8cmVzaXphYmxlPicgK1xuICAgICAgICAgICAgICAgICc8L3Jlc2l6YWJsZT4nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBnZW9tZXRyeVNlcnZpY2UuZ2V0Q29vcmRzKF9lbCk7XG5cbiAgICAgICAgICAgIGxldCBuZXdFbCA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBkcmFnWm9uZS5hcHBlbmQocmVzaXplRWwpO1xuICAgICAgICAgICAgcmVzaXplRWwuY3NzKHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWwuY3NzKCdwb3NpdGlvbicpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IGVsLmNzcygnbGVmdCcpLFxuICAgICAgICAgICAgICAgIHRvcDogZWwuY3NzKCd0b3AnKSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IGVsLmNzcygnei1pbmRleCcpLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBwb3NpdGlvbi53aWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBwb3NpdGlvbi5oZWlnaHQgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWwucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIG5ld0VsLnByb3AoJ3N0eWxlJywgbnVsbCk7XG4gICAgICAgICAgICBuZXdFbC5jc3Moe1xuICAgICAgICAgICAgICAgIHdpZHRoOiBwb3NpdGlvbi53aWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBwb3NpdGlvbi5oZWlnaHQgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzaXplRWwuYXBwZW5kKG5ld0VsKTtcblxuICAgICAgICAgICAgbGV0IG5ld1Njb3BlID0gJHNjb3BlLiRuZXcodHJ1ZSk7XG4gICAgICAgICAgICAkY29tcGlsZShyZXNpemVFbCkobmV3U2NvcGUpO1xuXG4gICAgICAgICAgICByZXNpemVFbC5vbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbmV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlUmVzaXphYmxlKCkge1xuXG4gICAgICAgIGxldCBlbGVtcyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgncmVzaXphYmxlJyk7XG5cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1zLCBmdW5jdGlvbiAoZG9tRWwsIGtleSkge1xuICAgICAgICAgICAgbGV0IGVsID0gYW5ndWxhci5lbGVtZW50KGRvbUVsKTtcbiAgICAgICAgICAgIGxldCBkcmFnWm9uZSA9IGVsLnBhcmVudCgpO1xuXG4gICAgICAgICAgICBsZXQgX2RuZEVsID0gZWwuZmluZCgnZG5kLWVsZW1lbnQnKTtcblxuICAgICAgICAgICAgZWwucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmICggX2RuZEVsLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsQ3NzID0ge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWwuY3NzKCdwb3NpdGlvbicpLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBlbC5jc3MoJ2xlZnQnKSxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBlbC5jc3MoJ3RvcCcpLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IGVsLmNzcygnei1pbmRleCcpLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogX2RuZEVsLmNzcygnd2lkdGgnKSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBfZG5kRWwuY3NzKCdoZWlnaHQnKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBsZXQgZG5kRWwgPSBfZG5kRWwuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBkbmRFbC5jc3MoZWxDc3MpO1xuXG4gICAgICAgICAgICAgICAgZHJhZ1pvbmUuYXBwZW5kKGRuZEVsKTtcblxuICAgICAgICAgICAgICAgIGxldCBuZXdTY29wZSA9ICRzY29wZS4kbmV3KHRydWUpO1xuICAgICAgICAgICAgICAgICRjb21waWxlKGRuZEVsKShuZXdTY29wZSk7XG5cbiAgICAgICAgICAgICAgICBkbmRFbC5vbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzaXplUmVmcmVzaCgpIHtcblxuXHRcdGlmICghJGN0cmwucmVzaXplTW9kZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBlbGVtcyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdyZXNpemFibGU6ZW1wdHknKSk7XG5cdFx0ZWxlbXMucmVtb3ZlKCk7XG5cblx0XHQkY3RybC5tYWtlUmVzaXphYmxlKCk7XG5cblx0fVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlUmVzaXplKCkge1xuICAgICAgICBpZiAoJGN0cmwucmVzaXplTW9kZSkge1xuICAgICAgICAgICAgJGN0cmwucmVtb3ZlUmVzaXphYmxlKCk7XG4gICAgICAgICAgICAkY3RybC5yZXNpemVNb2RlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkY3RybC5tYWtlUmVzaXphYmxlKCk7XG4gICAgICAgICAgICAkY3RybC5yZXNpemVNb2RlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE5vdGUoKSB7XG5cblx0XHQkY3RybC5uY291bnQgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2RuZC1lbGVtZW50JykubGVuZ3RoO1xuXHRcdGlmICghJGN0cmwubm90ZUZvcm0uJHZhbGlkIHx8ICRjdHJsLm5jb3VudCA+PSBuY291bnRfbWF4KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0JGN0cmwubnVtYmVyICsrO1xuXHRcdGxldCBzdWJqZWN0ID0gJ05vdGUgIycrICRjdHJsLm51bWJlcjtcblx0XHRsZXQgZHJhZ1pvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ1pvbmUnKTtcblx0XHRsZXQgZHJhZ0VsID0gYW5ndWxhci5lbGVtZW50KFxuXHRcdFx0JzxkbmQtZWxlbWVudD4nICtcblx0XHRcdFx0JzxwPjxiPicrc3ViamVjdCsnPC9iPjwvcD4nICtcblx0XHRcdFx0JzxwPicrJGN0cmwudGV4dCsnPC9wPicgK1xuXHRcdFx0JzwvZG5kLWVsZW1lbnQ+J1xuXHRcdCk7XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQoZHJhZ1pvbmUpLmFwcGVuZChkcmFnRWwpO1xuXG5cdFx0bGV0IG5ld1Njb3BlID0gJHNjb3BlLiRuZXcodHJ1ZSk7XG5cdFx0JGNvbXBpbGUoZHJhZ0VsKShuZXdTY29wZSk7XG5cblx0XHRkcmFnRWwub24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0bmV3U2NvcGUuJGRlc3Ryb3koKTtcblx0XHR9KTtcblxuXHRcdCRjdHJsLnRleHQgPSAnJztcblx0XHQkY3RybC5ub3RlRm9ybS4kc2V0UHJpc3RpbmUoKTtcblx0fVxufVxuIiwiKGZ1bmN0aW9uKCkge1xuICAgIGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2FwcC5ub3RlcycpXG4gICAgXHQucnVuKHJ1bik7XG5cbiAgICBydW4uJGluamVjdCA9IFsncm91dGVySGVscGVyJ107XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBydW4ocm91dGVySGVscGVyKSB7XG4gICAgXHRsZXQgc3RhdGVzID0gW1xuICAgIFx0XHR7XG4gICAgXHRcdFx0c3RhdGU6ICdhcHAubm90ZXMnLFxuICAgIFx0XHRcdGNvbmZpZzoge1xuICAgIFx0XHRcdFx0dXJsOiAnL25vdGVzJyxcbiAgICBcdFx0XHRcdHBhcmFtczoge1xuICAgIFx0XHRcdFx0XHR0aXRsZTogJ05vdGVzJ1xuICAgIFx0XHRcdFx0fSxcbiAgICBcdFx0XHRcdHZpZXdzOiB7XG4gICAgXHRcdFx0XHRcdCdjb250YWluZXJAJyA6IHtcbiAgICBcdFx0XHRcdFx0XHRjb21wb25lbnQ6ICdub3RlcydcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XTtcblxuICAgIFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhzdGF0ZXMpO1xuICAgIH1cbn0pKCk7XG4iLCJhbmd1bGFyXG5cdC5tb2R1bGUoJ2FwcC5yb3V0ZXInKVxuXHQucHJvdmlkZXIoJ3JvdXRlckhlbHBlcicsIHJvdXRlckhlbHBlclByb3ZpZGVyKTtcblxucm91dGVySGVscGVyUHJvdmlkZXIuJGluamVjdCA9IFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJ107XG4vKiBAbmdJbmplY3QgKi9cbmZ1bmN0aW9uIHJvdXRlckhlbHBlclByb3ZpZGVyKCRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cdC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuXHR0aGlzLiRnZXQgPSBSb3V0ZXJIZWxwZXI7XG5cblx0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG5cdFJvdXRlckhlbHBlci4kaW5qZWN0ID0gWyckc3RhdGUnXTtcblx0LyogQG5nSW5qZWN0ICovXG5cdGZ1bmN0aW9uIFJvdXRlckhlbHBlcigkc3RhdGUpIHtcblx0XHRsZXQgaGFzT3RoZXJ3aXNlID0gZmFsc2U7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29uZmlndXJlU3RhdGVzOiBjb25maWd1cmVTdGF0ZXMsXG5cdFx0XHRnZXRTdGF0ZXM6IGdldFN0YXRlc1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjb25maWd1cmVTdGF0ZXMoc3RhdGVzLCBvdGhlcndpc2VQYXRoKSB7Y29uc29sZS5sb2coc3RhdGVzKTtcblx0XHRcdHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKGN1cnJlbnRTdGF0ZSkge1xuXHRcdFx0XHQkc3RhdGVQcm92aWRlci5zdGF0ZShjdXJyZW50U3RhdGUuc3RhdGUsIGN1cnJlbnRTdGF0ZS5jb25maWcpO1xuXHRcdFx0fSk7XG5cdFx0XHRpZiAob3RoZXJ3aXNlUGF0aCAmJiAhaGFzT3RoZXJ3aXNlKSB7XG5cdFx0XHRcdGhhc090aGVyd2lzZSA9IHRydWU7XG5cdFx0XHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2Uob3RoZXJ3aXNlUGF0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCkge1xuXHRcdFx0cmV0dXJuICRzdGF0ZS5nZXQoKTtcblx0XHR9XG5cdH1cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuc2VhcmNoJylcbiAgICAuY29tcG9uZW50KCdzZWFyY2gnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6IFNlYXJjaENvbnRyb2xsZXIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9zZWFyY2gvc2VhcmNoLmNvbXBvbmVudC50bXBsLmh0bWwnXG4gICAgfSk7XG5cblNlYXJjaENvbnRyb2xsZXIuJGluamVjdCA9IFsnJGh0dHAnLCAnZ2xvYmFsVmFycyddO1xuZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkaHR0cCwgZ2xvYmFsVmFycykge1xuXG4gICAgY29uc3QgbGlzdFVybCA9ICdodHRwOi8vZGNvZGVpdC5uZXQvYW5ndWxhclRlc3QvZGF0YS5qc29uJztcblxuICAgIHZhciAkY3RybCA9IHRoaXM7XG5cbiAgICAkY3RybC5nbG9iYWxWYXJzID0gZ2xvYmFsVmFycy5kYXRhO1xuICAgICRjdHJsLmRhdGEgPSBbXTtcbiAgICAkY3RybC5zZWFyY2hXb3JkID0gJyc7XG4gICAgJGN0cmwuY3VyRmllbGRzID0ge1xuICAgICAgICBOYW1lOiBmYWxzZSxcbiAgICAgICAgVHlwZTogZmFsc2UsXG4gICAgICAgICdEZXNpZ25lZCBieSc6IGZhbHNlXG4gICAgfTtcbiAgICAkY3RybC5pbnNlbnMgPSB0cnVlO1xuICAgICRjdHJsLmV4YWN0ID0gZmFsc2U7XG4gICAgaW5pdCgpO1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgJGh0dHAuZ2V0KGxpc3RVcmwpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkY3RybC5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgYW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnYXBwLnNlYXJjaCcpXG4gICAgXHQucnVuKHJ1bik7XG5cbiAgICBydW4uJGluamVjdCA9IFsncm91dGVySGVscGVyJ107XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBydW4ocm91dGVySGVscGVyKSB7XG4gICAgXHRsZXQgc3RhdGVzID0gW1xuICAgIFx0XHR7XG4gICAgXHRcdFx0c3RhdGU6ICdhcHAuc2VhcmNoJyxcbiAgICBcdFx0XHRjb25maWc6IHtcbiAgICBcdFx0XHRcdHVybDogJy9zZWFyY2gnLFxuICAgIFx0XHRcdFx0cGFyYW1zOiB7XG4gICAgXHRcdFx0XHRcdHRpdGxlOiAnU2VhcmNoJ1xuICAgIFx0XHRcdFx0fSxcbiAgICBcdFx0XHRcdHZpZXdzOiB7XG4gICAgXHRcdFx0XHRcdCdjb250YWluZXJAJyA6IHtcbiAgICBcdFx0XHRcdFx0XHRjb21wb25lbnQ6ICdzZWFyY2gnXG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9XG4gICAgXHRcdH1cbiAgICBcdF07XG5cbiAgICBcdHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMoc3RhdGVzKTtcbiAgICB9XG5cbn0pKCk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnRyYW5zbGF0aW9ucycpXG4gICAgLmNvbXBvbmVudCgndHJhbnNsYXRpb25zJywge1xuICAgICAgICBjb250cm9sbGVyOiBUcmFuc2xhdGlvbnNDb250cm9sbGVyLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAvdHJhbnNsYXRpb25zL3RyYW5zbGF0aW9ucy5jb21wb25lbnQudG1wbC5odG1sJ1xuICAgIH0pO1xuXG5UcmFuc2xhdGlvbnNDb250cm9sbGVyLiRpbmplY3QgPSBbJ3RyYW5zbGF0aW9uU2VydmljZScsICdnbG9iYWxWYXJzJ107XG5mdW5jdGlvbiBUcmFuc2xhdGlvbnNDb250cm9sbGVyKHRyYW5zbGF0aW9uU2VydmljZSwgZ2xvYmFsVmFycykge1xuXG4gICAgdmFyICRjdHJsID0gdGhpcztcblxuICAgICRjdHJsLmdsb2JhbFZhcnMgPSBnbG9iYWxWYXJzLmRhdGE7XG4gICAgJGN0cmwuY3VyTGFuZyA9ICdlbmcnO1xuICAgICRjdHJsLnBhZ2VXb3JkcyA9IHt9O1xuICAgICRjdHJsLnN3aXRjaCA9IHN3aXRjaExhbmc7XG5cbiAgICBpbml0KCk7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICB0cmFuc2xhdGlvblNlcnZpY2UuZ2V0TGFuZ3MoKS50aGVuKGZ1bmN0aW9uIChsYW5ncykge1xuICAgICAgICAgICAgJGN0cmwubGFuZ3MgPSBsYW5ncztcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGN0cmwuc3dpdGNoKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3dpdGNoTGFuZygpIHtcbiAgICAgICAgJGN0cmwucGFnZVdvcmRzID0gdHJhbnNsYXRpb25TZXJ2aWNlLmdldExvY2FsKCRjdHJsLmN1ckxhbmcpO1xuICAgICAgICBpZiAoJGN0cmwucGFnZVdvcmRzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvblNlcnZpY2UubG9hZCgkY3RybC5jdXJMYW5nKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgJGN0cmwucGFnZVdvcmRzID0gZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiKGZ1bmN0aW9uKCkge1xuICAgIGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2FwcC50cmFuc2xhdGlvbnMnKVxuICAgIFx0LnJ1bihydW4pO1xuXG4gICAgcnVuLiRpbmplY3QgPSBbJ3JvdXRlckhlbHBlciddO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gcnVuKHJvdXRlckhlbHBlcikge1xuICAgIFx0bGV0IHN0YXRlcyA9IFtcbiAgICBcdFx0e1xuICAgIFx0XHRcdHN0YXRlOiAnYXBwLnRyYW5zbGF0aW9ucycsXG4gICAgXHRcdFx0Y29uZmlnOiB7XG4gICAgXHRcdFx0XHR1cmw6ICcvdHJhbnNsYXRpb25zJyxcbiAgICBcdFx0XHRcdHBhcmFtczoge1xuICAgIFx0XHRcdFx0XHR0aXRsZTogJ1RyYW5zbGF0aW9ucydcbiAgICBcdFx0XHRcdH0sXG4gICAgXHRcdFx0XHR2aWV3czoge1xuICAgIFx0XHRcdFx0XHQnY29udGFpbmVyQCcgOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29tcG9uZW50OiAndHJhbnNsYXRpb25zJ1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fVxuICAgIFx0XHR9XG4gICAgXHRdO1xuXG4gICAgXHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKHN0YXRlcyk7XG4gICAgfVxuXG59KSgpO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC51c2VycycpXG4gICAgLmNvbXBvbmVudCgndXNlcnMnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6IFVzZXJzQ29udHJvbGxlcixcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL3VzZXJzL3VzZXJzLmNvbXBvbmVudC50bXBsLmh0bWwnXG4gICAgfSk7XG5cblVzZXJzQ29udHJvbGxlci4kaW5qZWN0ID0gWydzdG9yYWdlU2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJywgJ2dsb2JhbFZhcnMnXTtcbmZ1bmN0aW9uIFVzZXJzQ29udHJvbGxlcihzdG9yYWdlU2VydmljZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIGdsb2JhbFZhcnMpIHtcblxuICAgIGxldCBkZWZhdWx0VXNlcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiAnU2FtJyxcbiAgICAgICAgICAgIGVtYWlsOiAnc2FtdWVsMzNAZ21haWwuY29tJyxcbiAgICAgICAgICAgIGNvdW50cnk6ICdVU0EnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICchQDEyM0FhYWEnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB1c2VybmFtZTogJ1JpY2snLFxuICAgICAgICAgICAgZW1haWw6ICdyaWNrbWlsbGVyQGdtYWlsLmNvbScsXG4gICAgICAgICAgICBjb3VudHJ5OiAnVVNBJyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAnIUAxMjNBYWFhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdXNlcm5hbWU6ICdMaW5kYScsXG4gICAgICAgICAgICBlbWFpbDogJ3BhcGFwYTQxNDFAZ21haWwuY29tJyxcbiAgICAgICAgICAgIGNvdW50cnk6ICdDYW5hZGEnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICchQDEyM0FhYWEnLFxuICAgICAgICB9XG4gICAgXTtcblxuICAgIHZhciAkY3RybCA9IHRoaXM7XG5cbiAgICAkY3RybC5nbG9iYWxWYXJzID0gZ2xvYmFsVmFycy5kYXRhO1xuICAgICRjdHJsLmRhdGEgPSB7fTtcbiAgICAkY3RybC5wd2RSZWdleCA9IC9eKD89LipbQS1aXSkoPz0uKlxcZCkoPz0uKlskQCElKiM/Jl0pW0EtWmEtelxcZCRAISUqIz8mXSskLztcbiAgICAkY3RybC5zdWJtaXQgPSBzdWJtaXQ7XG4gICAgJGN0cmwudXNlcklkID0gbnVsbDtcbiAgICAkY3RybC5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcblxuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICRjdHJsLnVzZXJzID0gc3RvcmFnZVNlcnZpY2UuZ2V0TG9jYWwoJ3VzZXJzJyk7XG4gICAgICAgIGlmICghJGN0cmwudXNlcnMpIHtcbiAgICAgICAgICAgIHN0b3JhZ2VTZXJ2aWNlLnNldExvY2FsKCd1c2VycycsIGRlZmF1bHRVc2Vycyk7XG4gICAgICAgICAgICAkY3RybC51c2VycyA9IGRlZmF1bHRVc2VycztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkc3RhdGVQYXJhbXMudXNlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkY3RybC51c2VySWQgPSAkc3RhdGVQYXJhbXMudXNlcklkO1xuICAgICAgICAgICAgJGN0cmwuZGF0YSA9IGFuZ3VsYXIuY29weSgkY3RybC51c2Vyc1skc3RhdGVQYXJhbXMudXNlcklkXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWJtaXQodXNlcklkKSB7XG4gICAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgICAgIGVkaXQodXNlcklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGN0cmwudXNlcnNGb3JtLiRzZXRQcmlzdGluZSgpO1xuICAgICAgICBzdG9yYWdlU2VydmljZS5zZXRMb2NhbCgndXNlcnMnLCAkY3RybC51c2Vycyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkKCkge1xuICAgICAgICAkY3RybC51c2Vycy5wdXNoKCRjdHJsLmRhdGEpO1xuICAgICAgICAkY3RybC5kYXRhID0ge307XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VySWQpIHtcbiAgICAgICAgJHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50Lm5hbWUsIHsndXNlcklkJzogdXNlcklkfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZWRpdCh1c2VySWQpIHtcbiAgICAgICAgJGN0cmwuZGF0YS5wYXNzd29yZCA9ICRjdHJsLmRhdGEubmV3cGFzc3dvcmQ7XG4gICAgICAgICRjdHJsLmRhdGEubmV3cGFzc3dvcmQgPSAkY3RybC5kYXRhLm5ld3Bhc3N3b3JkcmVwZWF0ID0gbnVsbDtcblxuICAgICAgICAkY3RybC51c2Vyc1t1c2VySWRdID0gYW5ndWxhci5jb3B5KCRjdHJsLmRhdGEpO1xuICAgIH1cbn1cbiIsIihmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdhcHAudXNlcnMnKVxuICAgIFx0LnJ1bihydW4pO1xuXG4gICAgcnVuLiRpbmplY3QgPSBbJ3JvdXRlckhlbHBlciddO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gcnVuKHJvdXRlckhlbHBlcikge1xuICAgIFx0bGV0IHN0YXRlcyA9IFtcbiAgICBcdFx0e1xuICAgIFx0XHRcdHN0YXRlOiAnYXBwLnVzZXJzJyxcbiAgICBcdFx0XHRjb25maWc6IHtcbiAgICBcdFx0XHRcdHVybDogJy91c2Vycy97dXNlcklkOmludH0nLFxuICAgIFx0XHRcdFx0cGFyYW1zOiB7XG4gICAgXHRcdFx0XHRcdHRpdGxlOiAnVXNlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXNoOiB0cnVlIC8vIHBhcmFtIGlzIG9wdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgXHRcdFx0XHR9LFxuICAgIFx0XHRcdFx0dmlld3M6IHtcbiAgICBcdFx0XHRcdFx0J2NvbnRhaW5lckAnIDoge1xuICAgIFx0XHRcdFx0XHRcdGNvbXBvbmVudDogJ3VzZXJzJ1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fVxuICAgIFx0XHR9XG4gICAgXHRdO1xuXG4gICAgXHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKHN0YXRlcyk7XG4gICAgfVxufSkoKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuYXV0aCcpXG4gICAgLmNvbXBvbmVudCgnbG9naW4nLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlcixcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2F1dGgvbG9naW4vbG9naW4uY29tcG9uZW50LnRtcGwuaHRtbCdcbiAgICB9KTtcblxuTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJyRjb29raWVzJywgJyRsb2NhdGlvbicsICdnbG9iYWxWYXJzJ107XG5mdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsICRjb29raWVzLCAkbG9jYXRpb24sIGdsb2JhbFZhcnMpIHtcblxuICAgIHZhciAkY3RybCA9IHRoaXM7XG5cbiAgICAkY3RybC5nbG9iYWxWYXJzID0gZ2xvYmFsVmFycy5kYXRhO1xuICAgICRjdHJsLmRhdGEgPSB7fTtcbiAgICAkY3RybC5kYXRhLnJlbWVtYmVyTWUgPSB0cnVlO1xuXG4gICAgJGN0cmwuc3VibWl0ID0gc3VibWl0O1xuXG4gICAgZnVuY3Rpb24gc3VibWl0KCkge1xuXG4gICAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luKCRjdHJsLmRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICRjdHJsLmZvcm1FcnJvcnMgPSByZXNwb25zZS5kYXRhLmVycm9ycyB8fCB7fTtcblxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5kYXRhLmVycm9ycykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRjb29raWVzLmdldEFsbCgpKTtcbiAgICAgICAgICAgICAgICBnbG9iYWxWYXJzLnNldFZhcignbG9nZ2VkSW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi90cmFuc2xhdGlvbnNcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gJGN0cmwubG9naW5Gb3JtLiQkY29udHJvbHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29udHJvbCA9ICRjdHJsLmxvZ2luRm9ybS4kJGNvbnRyb2xzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRjdHJsLmZvcm1FcnJvcnNbY29udHJvbC4kbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbC4kc2V0VmFsaWRpdHkoY29udHJvbC4kbmFtZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2wuJHNldFZhbGlkaXR5KGNvbnRyb2wuJG5hbWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwLmF1dGgnKVxuICAgIC5jb21wb25lbnQoJ3JlZ2lzdHJhdGlvbicsIHtcbiAgICAgICAgY29udHJvbGxlcjogUmVnaXN0cmF0aW9uQ29udHJvbGxlcixcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2F1dGgvcmVnaXN0cmF0aW9uL3JlZ2lzdHJhdGlvbi5jb21wb25lbnQudG1wbC5odG1sJ1xuICAgIH0pO1xuXG5SZWdpc3RyYXRpb25Db250cm9sbGVyLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJ2dsb2JhbFZhcnMnXTtcbmZ1bmN0aW9uIFJlZ2lzdHJhdGlvbkNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGdsb2JhbFZhcnMpIHtcblxuICAgIHZhciAkY3RybCA9IHRoaXM7XG5cbiAgICAkY3RybC5nbG9iYWxWYXJzID0gZ2xvYmFsVmFycy5kYXRhO1xuICAgICRjdHJsLmRhdGEgPSB7fTtcbiAgICAkY3RybC5wd2RSZWdleCA9IC9eKD89LipbQS1aXSkoPz0uKlxcZCkoPz0uKlskQCElKiM/Jl0pW0EtWmEtelxcZCRAISUqIz8mXSskLztcblxuICAgICRjdHJsLnN1Ym1pdCA9IHN1Ym1pdDtcblxuICAgIGZ1bmN0aW9uIHN1Ym1pdCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3ZhbGlkJyk7XG4gICAgICAgIGF1dGhTZXJ2aWNlLnJlZ2lzdHJhdGUoJGN0cmwuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvaycpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmF1dGgnKVxuICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcblxuYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwLCAkdGltZW91dCkge1xuICAgIGNvbnN0IHVybCA9ICdodHRwOi8vZGNvZGVpdC5uZXQvdGVuZGVybWFzdGVyd2ViL3B1YmxpYy9hcGkvJztcblxuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgbGV0IHN0ciA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgcCBpbiBvYmopXG4gICAgICAgICAgICAgICAgc3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHApICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW3BdKSk7XG4gICAgICAgICAgICByZXR1cm4gc3RyLmpvaW4oXCImXCIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMubG9naW4gPSBsb2dpbjtcbiAgICB0aGlzLmxvZ291dCA9IGxvZ291dDtcbiAgICB0aGlzLnJlZ2lzdHJhdGUgPSByZWdpc3RyYXRlO1xuXG4gICAgZnVuY3Rpb24gbG9naW4oZGF0YSkge1xuICAgICAgICBvcHRpb25zLnVybCA9IHVybCArICdsb2dpbic7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHJldHVybiAkaHR0cChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgIG9wdGlvbnMudXJsID0gdXJsICsgJ2xvZ291dCc7XG4gICAgICAgIHJldHVybiAkaHR0cChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RyYXRlKCkge1xuICAgICAgICByZXR1cm4gJHRpbWVvdXQoMTAwMCk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBQcm92aWRlcyBhIHdheSB0byBjYXB0dXJlIHdoZW5ldmVyIGEgY2xpY2sgaGFwcGVucyBvdXRzaWRlIG9mIGFuIGVsZW1lbnQgKGV2ZW4gaWYgdGhlIGVsZW1lbnQgaGFzIG5vIGJsdXIgZXZlbnQpLiBEdWVcbiAqIHRvIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbiwgdGhpcyBET0VTIE5PVCBydW4gYW4gJGFwcGx5IGFmdGVyIHRoZSBvbkNsaWNrT3V0IGhhbmRsZXIgdW5sZXNzIHlvdSByZXR1cm4gdHJ1ZS4gZS5nLlxuICpcbiAqICAgICAgPG15LWNsaWNrLW91dCBuZy1pZj1cImVkaXRNb2RlXCIgb24tY2xpY2stb3V0PVwiZmluaXNoRWRpdGluZygpXCIgc2VsZWN0b3I9XCIudGFzay1lZGl0XCI+PC9teS1jbGljay1vdXQ+XG4gKlxuICogQGJpbmRpbmcgc2VsZWN0b3IgVGhlIHN0cmluZyBvZiB3aGF0IGRvZXMgbm90IHRyaWdnZXIgdGhlIGNsaWNrIG91dC4gVGhpcyBjYW4gYmUgYW55IHZhbGlkIGpRdWVyeSBzZWxlY3RvciBhbmQgY2FuXG4gKiAgICAgICAgICAgICAgICAgICBzcGVjaWZ5IG11bHRpcGxlIGVsZW1lbnRzLlxuICogQGJpbmRpbmcgb25DbGlja091dCBUaGlzIGkgICBzIGNhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGlzIG5vIGxvbmdlciBjbGlja2VkIG9uLiBSZXR1cm4gdHJ1ZSB0byBkbyBhICRhcHBseS4gQnV0IGRvIHNvXG4gKiAgICAgICAgICAgICAgICAgICAgIGNhcmVmdWxseSBiZWNhdXNlICRhcHBseSBhcmUgdmVyeSBleHBlbnNpdmUgYW5kIGNhbiBoYXZlIGxhcmdlIHBlcmZvcm1hbmNlIHBlbmFsdGllcyB3aGVuIHRoZXJlXG4gKiAgICAgICAgICAgICAgICAgICAgIGFyZSBsb3RzIG9mIG90aGVyIGNsaWNrb3V0cy4gRm9yIGV4YW1wbGUsIGluIGdyaWRzLlxuICovXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbW1vbicpXG4gICAgLmNvbXBvbmVudCgnbXlDbGlja091dCcsIHtcbiAgICAgICAgY29udHJvbGxlcjogTXlDbGlja091dENvbnRyb2xsZXIsXG4gICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICBzZWxlY3RvcnM6ICc8JyxcbiAgICAgICAgICAgIG9uQ2xpY2tPdXQ6ICcmJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbk15Q2xpY2tPdXRDb250cm9sbGVyLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJGVsZW1lbnQnLCAnJHNjb3BlJ107XG5mdW5jdGlvbiBNeUNsaWNrT3V0Q29udHJvbGxlcigkd2luZG93LCAkZWxlbWVudCwgJHNjb3BlKSB7XG4gICAgdmFyICRjdHJsID0gdGhpcztcblxuICAgICRjdHJsLiRwb3N0TGluayA9ICRwb3N0TGluaztcblxuICAgIGZ1bmN0aW9uICRwb3N0TGluaygpIHtcblxuICAgICAgICBkb2N1bWVudC5vbm1vdXNlZG93biA9IGNoZWNrSWZDbGlja091dHNpZGVTZWxlY3Rpb25BcmVhO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub24oJ2JsdXInICxjaGVja0lmQ2xpY2tPdXRzaWRlU2VsZWN0aW9uQXJlYSk7XG4gICAgICAgIC8vIFRoZXJlIGlzIG5vIHBvaW50IGluIGxpc3RlbmluZyBmb3IgY2xpY2sgb3V0cyB3aGVuIHRoZSBlbGVtZW50IGlzIG5vIGxvbmdlciB1c2VkIGJ5IEFuZ3VsYXIuXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZWRvd24gPSBudWxsO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLnVuYmluZCgnYmx1cicsIGNoZWNrSWZDbGlja091dHNpZGVTZWxlY3Rpb25BcmVhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSByZWFsIGFic29sdXRlIGVsZW1lbnQgcG9zaXRpb24uIE9mZnNldCBiYXNlZCBtZXRob2RzLCBpbmNsdWRpbmcgdGhvc2Ugd2l0aCBvZmZzZXRQYXJlbnQgaW5jbHVkZWQgYXJlXG4gICAgICogYnVnZ3kuIFRoaXMgZ2V0cyB0aGUgYm91bmRpbmcgcmVjdGFuZ2xlIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgaW4gdGhlIGN1cnJlbnQgdmlld3BvcnQgdGhlbiBhZGRzIHRoZSBzY3JvbGwuXG4gICAgICogRmluYWxseSwgdGhlIGJvZHkgYm9yZGVycyBhcmUgc3VidHJhY3RlZCBqdXN0IGluIGNhc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGVsZSBUaGUgcmF3IERPTSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDb250YWlucyB0aGUgdG9wIGFuZCBsZWZ0IHByb3BlcnRpZXMgb2YgYW4gZWxlbWVudCBmb3IgdGhlIGVudGlyZSBwYWdlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEFic29sdXRlVG9wTGVmdChlbGUpIHtcbiAgICAgICAgbGV0IGJveCA9IGVsZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAvLyBNYXRoLnJvdW5kIGJlY2F1c2UgaXQgaXMgYWN0dWFsbHkgcG9zc2libGUgdG8gZ2V0IGZyYWN0aW9uYWwgcGl4ZWxzLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKGJveC50b3AgKyAgd2luZG93LnBhZ2VZT2Zmc2V0IC0gZG9jdW1lbnQuYm9keS5jbGllbnRUb3ApLFxuICAgICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCAtIGRvY3VtZW50LmJvZHkuY2xpZW50TGVmdClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb2ludCBjb2xsaXNpb24gZGV0ZWN0aW9uIChpcyB0aGUgbW91c2UgaW4gdGhlIGVsZW1lbnQ/KS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZWxlIFRoZSBBbmd1bGFyIGVsZW1lbnQgdG8gY2hlY2sgZm9yIGlmIHRoZSBtb3VzZSBpcyBpblxuICAgICAqIEBwYXJhbSAge09iamVjdH0gcG9pbnRlciBUaGUgalF1ZXJ5IEV2ZW50IG9iamUgICBjdCB3aGljaCBnaXZlcyB0aGUgbW91c2UgcG9pbnRlciBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IElmIHRoZSBwb2ludGVyIGlzIGluIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbGxpc2lvbk9uUG9pbnQoZWxlLCBwb2ludGVyKSB7XG4gICAgICAgIGxldCBib3VuZHMgPSBnZXRBYnNvbHV0ZVRvcExlZnQoZWxlKSxcbiAgICAgICAgICAgIGxlZnRFZGdlID0gYm91bmRzLmxlZnQsXG4gICAgICAgICAgICB0b3BFZGdlID0gYm91bmRzLnRvcCxcbiAgICAgICAgICAgIGJvdHRvbUVkZ2UgPSB0b3BFZGdlICsgZWxlLm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgIHJpZ2h0RWRnZSA9IGxlZnRFZGdlICsgZWxlLm9mZnNldFdpZHRoO1xuXG4gICAgICAgIHJldHVybiBwb2ludGVyLnBhZ2VYID49IGxlZnRFZGdlICYmIHBvaW50ZXIucGFnZVggPD0gcmlnaHRFZGdlICYmXG4gICAgICAgICAgICBwb2ludGVyLnBhZ2VZID49IHRvcEVkZ2UgJiYgcG9pbnRlci5wYWdlWSA8PSBib3R0b21FZGdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGwgdGhlIGJvdW5kIGNsaWNrT3V0IG1ldGhvZC4gSWYgaXQgcmV0dXJucyB0cnVlLCBkbyBhICRhcHBseSBpbiB0aGlzIHNjb3BlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvQ2xpY2tPdXQoKSB7XG4gICAgICAgIGlmICgkY3RybC5vbkNsaWNrT3V0KCkpIHtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgc2VsZWN0aW9uIGlzIG91dHNpZGUgb2YgdGhlIHNlbGVjdGlvbiBhcmVhIGluIDIgc3RlcHMuIElmIGFueSBvZiB0aGUgc3RlcHMgc3VjY2VlZCwgdGhlXG4gICAgICogY2xpY2tvdXQgaXMgZmlyZWQgYW5kIHRoZSBvdGhlciBzdGVwcyBhcmUgbm90IHZpc2l0ZWQ6XG4gICAgICogMS4gSWYgdGhlIGNvbnRhaW5lciBjYW5ub3QgYmUgZm91bmRcbiAgICAgKiAyLiBJZiB0aGUgY29udGFpbmVyIGNhbiBiZSBmb3VuZCBjaGVjayBpZiB0aGUgbW91c2UgaXMgaW4gdGhlIGVsZW1lbnRcbiAgICAgKiAzLiBJZiB0aGUgbW91c2UgaXMgbm90IGluIHRoZSBlbGVtZW50LCBjaGVjayBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgdGhlIGVsZW1lbnQgb3IgaXMgYSBjaGlsZCBvZiBpdC4gU29tZVxuICAgICAqICAgIGVsZW1lbnRzIGhhdmUgbm8gaGVpZ2h0LCBzbyB0aGlzIDNyZCBzdGVwIGlzIG5lY2Vzc2FyeS5cbiAgICAgKiBUaGlzIGFsZ29yaXRobSBhc3N1bWVzIHRoYXQgY2xpY2tvdXQgZXZlbnRzIGFyZSB2ZXJ5IGZyZXF1ZW50IGFzIG1vc3QgZWxlbWVudHMgZG8gbm90IGNvdmVyIG11Y2ggb2YgdGhlXG4gICAgICogc2NyZWVuLiBTbyBub24tY2xpY2tvdXRzIGFyZSBjb21wdXRhdGlvbmFsbHkgZXhwZW5zaXZlIGluc3RlYWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGUgVGhlIGV2ZW50IGZyb20gdGhlIGJyb3dzZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGVja0lmQ2xpY2tPdXRzaWRlU2VsZWN0aW9uQXJlYShlKSB7XG4gICAgICAgIGlmKCB0eXBlb2YgJGN0cmwuc2VsZWN0b3JzID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICRjdHJsLnNlbGVjdG9ycyA9IFsgJGN0cmwuc2VsZWN0b3JzIF07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29udGFpbmVyID0gW107XG4gICAgICAgICRjdHJsLnNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChzZWwpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9ICRlbGVtZW50LnBhcmVudCgpLmZpbmQoc2VsKTtcblxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1hdGNoLCBmdW5jdGlvbiAoc3ViRWwpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaChzdWJFbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY29udGFpbmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZG9DbGlja091dCgpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzID0gW107XG4gICAgICAgIGNvbnRhaW5lci5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmVzLnB1c2goY29sbGlzaW9uT25Qb2ludChlbCwgZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzLnNvbWUoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdHJ1ZTtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9DbGlja091dCgpO1xuICAgIH1cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tbW9uJylcbiAgICAuY29tcG9uZW50KCdkbmRFbGVtZW50Jywge1xuICAgICAgICBjb250cm9sbGVyOiBEbmRFbGVtZW50Q29udHJvbGxlcixcbiAgICAgICAgcmVxdWlyZToge1xuICAgICAgICAgICAgZG5kWm9uZTogJ15eZG5kWm9uZSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG5EbmRFbGVtZW50Q29udHJvbGxlci4kaW5qZWN0ID0gWyckZWxlbWVudCddO1xuXG5mdW5jdGlvbiBEbmRFbGVtZW50Q29udHJvbGxlcigkZWxlbWVudCkge1xuICAgIHZhciAkY3RybCA9IHRoaXM7XG5cbiAgICAkY3RybC4kb25Jbml0ID0gaW5pdDtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAgICAgJGVsZW1lbnQub24oJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS53aGljaCAhPSAxKSB7IC8vINC90LUg0LvQtdCy0L7QuSDQutC90L7Qv9C60L7QuVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkY3RybC5kbmRab25lLmRyYWdUYXJnZXQgPSB7XHJcbiAgICAgICAgICAgICAgICBkcmFnRWxlbWVudDogJGVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydFg6IGUucGFnZVgsXHJcbiAgICAgICAgICAgICAgICBzdGFydFk6IGUucGFnZVlcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21tb24nKVxuICAgIC5jb21wb25lbnQoJ2RuZFpvbmUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6IERuZFpvbmVDb250cm9sbGVyLFxuICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgbW9kZTogJ0AnLFxuICAgICAgICAgICAgb25TdGFydDogJyYnLFxuICAgICAgICAgICAgb25FbmQ6ICcmJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbkRuZFpvbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRkb2N1bWVudCcsICckZWxlbWVudCcsICdnZW9tZXRyeVNlcnZpY2UnXTtcblxuLyoqXG4gKlxuICogRG5kIHpvbmUgY29udHJvbGxlclxuICogZG5kIGZsb3cgbWFuYWdlXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIERuZFpvbmVDb250cm9sbGVyKCRkb2N1bWVudCwgJGVsZW1lbnQsIGdlb21ldHJ5U2VydmljZSkge1xuICAgIHZhciAkY3RybCA9IHRoaXM7XG4gICAgJGN0cmwuZHJhZ1RhcmdldCA9IG51bGw7XG4gICAgJGN0cmwuX2VsZW0gPSBudWxsO1xuXG4gICAgJGN0cmwuJHBvc3RMaW5rID0gaW5pdDtcblxuXHQvKipcbiAgICAgKiBNYWluIHNldHVwIGxpc3RlbmVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICRlbGVtZW50WzBdLm1vZGUgPSAkY3RybC5tb2RlO1xuXG4gICAgICAgIGlmICgkY3RybC5tb2RlICE9PSAnZHJhZycpIHtcbiAgICAgICAgICAgICRlbGVtZW50Lm9uKCdkcm9wcmVhZHknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICRlbGVtZW50LmNzcyh7J2JhY2tncm91bmQtY29sb3InOiAnIzI3YWU2MCd9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVhZHkgdG8gZHJvcCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkZWxlbWVudC5vbignZHJhZ2xlYXZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5jc3MoeydiYWNrZ3JvdW5kLWNvbG9yJzogbnVsbH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkcmFnIGVsIGxlZnQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG4gICAgICAgICRkb2N1bWVudC5vbignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cbiAgICAgICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xuICAgICAgICAgICAgaWYgKCEkY3RybC5kcmFnVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZS5wYWdlWCAtICRjdHJsLnN0YXJ0WCkgPCAzICYmIE1hdGguYWJzKGUucGFnZVkgLSAkY3RybC5zdGFydFkpIDwgMykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCAkY3RybC5fZWxlbSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICAkY3RybC5vblN0YXJ0ICYmICRjdHJsLm9uU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBkcmFnU3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25EcmFnTW92ZShlKTtcblxuICAgICAgICAgICAgbGV0IG5ld0Ryb3BUYXJnZXQgPSBmaW5kRHJvcFRhcmdldCgpO1xuXG4gICAgICAgICAgICBpZiAobmV3RHJvcFRhcmdldCAhPSAkY3RybC5fZHJvcFRhcmdldCkge1xuICAgICAgICAgICAgICAgICRjdHJsLl9kcm9wVGFyZ2V0ICYmIGFuZ3VsYXIuZWxlbWVudCgkY3RybC5fZHJvcFRhcmdldCkudHJpZ2dlckhhbmRsZXIoJ2RyYWdsZWF2ZScpO1xuICAgICAgICAgICAgICAgIG5ld0Ryb3BUYXJnZXQgJiYgYW5ndWxhci5lbGVtZW50KG5ld0Ryb3BUYXJnZXQpLnRyaWdnZXJIYW5kbGVyKCdkcm9wcmVhZHknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGN0cmwuX2Ryb3BUYXJnZXQgPSBuZXdEcm9wVGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25Nb3VzZVVwKGUpIHtcblxuICAgICAgICAgICAgaWYgKGUud2hpY2ggIT0gMSkgeyAvLyDQvdC1INC70LXQstC+0Lkg0LrQvdC+0L/QutC+0LlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoISRjdHJsLmRyYWdUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkY3RybC5fZWxlbSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRjdHJsLl9kcm9wVGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAoJGN0cmwuX2Ryb3BUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHJhZ0VuZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGxCYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkY3RybC5kcmFnVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgICRjdHJsLl9lbGVtID0gbnVsbDtcbiAgICAgICAgICAgICRjdHJsLl9kcm9wVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgICRjdHJsLm9sZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJldmVydCBtb3ZlIGFjdGlvbnNcbiAgICAqXG4gICAgKiovXG4gICAgZnVuY3Rpb24gcm9sbEJhY2soKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyb2xsYmFjaycpO1xuXG4gICAgICAgICRjdHJsLm9sZC5wYXJlbnQuaW5zZXJ0QmVmb3JlKCRjdHJsLl9lbGVtLCAkY3RybC5vbGQubmV4dFNpYmxpbmcpO1xuXG4gICAgICAgIGxldCBjb29yZHMgPSBnZW9tZXRyeVNlcnZpY2UuZ2V0Q29vcmRzKCRjdHJsLm9sZC5wYXJlbnQpO1xuICAgICAgICAkY3RybC5fZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICRjdHJsLm9sZC5wb3NpdGlvbjtcbiAgICAgICAgJGN0cmwuX2VsZW0uc3R5bGUubGVmdCA9ICRjdHJsLm9sZC5sZWZ0IC0gY29vcmRzLmxlZnQgLSAkY3RybC5fbWFyZ2luICsgJ3B4JztcbiAgICAgICAgJGN0cmwuX2VsZW0uc3R5bGUudG9wID0gJGN0cmwub2xkLnRvcCAtIGNvb3Jkcy50b3AgLSAkY3RybC5fbWFyZ2luICsgJ3B4JztcbiAgICAgICAgJGN0cmwuX2VsZW0uc3R5bGUuekluZGV4ID0gJGN0cmwub2xkLnpJbmRleDtcblxuICAgICAgICAkY3RybC5vbkVuZCAmJiAkY3RybC5vbkVuZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogRW5kIG9mIGRyYWcgYWN0aW9uLiBBcHBlbmQgdG8gdGFyZ2V0IHpvbmUuIFBvc2l0aW9uIGFkanVzdG1lbnQuXG4gICAgKlxuICAgICoqL1xuICAgIGZ1bmN0aW9uIGRyYWdFbmQoKSB7XG4gICAgICAgIGlmICgkY3RybC5fZHJvcFRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnZHJhZyBlbmQnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCRjdHJsLl9kcm9wVGFyZ2V0KS50cmlnZ2VySGFuZGxlcignZHJhZ2xlYXZlJyk7XG5cbiAgICAgICAgaWYgKCRjdHJsLl9kcm9wVGFyZ2V0Lm1vZGUgPT09ICd0cmFzaCcpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkY3RybC5fZWxlbSkucmVtb3ZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgY29vcmRzRWwgPSBnZW9tZXRyeVNlcnZpY2UuZ2V0Q29vcmRzKCRjdHJsLl9lbGVtKTtcbiAgICAgICAgICAgIGxldCBjb29yZHNab25lID0gZ2VvbWV0cnlTZXJ2aWNlLmdldENvb3JkcygkY3RybC5fZHJvcFRhcmdldCk7XG4gICAgICAgICAgICBsZXQgZGlmZkxlZnQgPSBjb29yZHNab25lLmxlZnQgLSBjb29yZHNFbC5sZWZ0ICsgMTA7XG4gICAgICAgICAgICBsZXQgZGlmZlRvcCA9IGNvb3Jkc1pvbmUudG9wIC0gY29vcmRzRWwudG9wICsgMTA7XG4gICAgICAgICAgICBsZXQgZGlmZlJpZ2h0ID0gY29vcmRzWm9uZS5yaWdodCAtIGNvb3Jkc0VsLnJpZ2h0IC0gMTA7XG4gICAgICAgICAgICBsZXQgZGlmZkJvdHRvbSA9IGNvb3Jkc1pvbmUuYm90dG9tIC0gY29vcmRzRWwuYm90dG9tIC0gMTA7XG5cbiAgICAgICAgICAgIGxldCBsZWZ0ID0gJGN0cmwuX2VsZW1YIC0gY29vcmRzWm9uZS5sZWZ0IC0gJGN0cmwuX21hcmdpbjtcbiAgICAgICAgICAgIGxldCB0b3AgPSAkY3RybC5fZWxlbVkgLSBjb29yZHNab25lLnRvcCAtICRjdHJsLl9tYXJnaW47XG5cbiAgICAgICAgICAgIGlmIChjb29yZHNab25lLmxlZnQgPiBjb29yZHNFbC5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgbGVmdCArPSBkaWZmTGVmdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvb3Jkc1pvbmUudG9wID4gY29vcmRzRWwudG9wKSB7XG4gICAgICAgICAgICAgICAgdG9wICs9IGRpZmZUb3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb29yZHNab25lLmJvdHRvbSA8IGNvb3Jkc0VsLmJvdHRvbSkge1xuICAgICAgICAgICAgICAgIHRvcCArPSBkaWZmQm90dG9tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29vcmRzWm9uZS5yaWdodCA8IGNvb3Jkc0VsLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgbGVmdCArPSBkaWZmUmlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjdHJsLl9kcm9wVGFyZ2V0LmFwcGVuZENoaWxkKCRjdHJsLl9lbGVtKTtcbiAgICAgICAgICAgICRjdHJsLl9lbGVtLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICRjdHJsLl9lbGVtLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICAkY3RybC5vbkVuZCAmJiAkY3RybC5vbkVuZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogU3RhcnQgZHJhZy4gU2F2ZSBvbGQgcG9zaXRpb24uIE1vdmUgZWxlbWVudCB0byBib2R5IHNjb3BlLlxuICAgICpcbiAgICAqKi9cbiAgICBmdW5jdGlvbiBkcmFnU3RhcnQoKSB7XG4gICAgICAgIGlmICghJGN0cmwuZHJhZ1RhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdkcmFnIHN0YXJ0Jyk7XG5cbiAgICAgICAgLy8g0YHQvtC30LTQsNGC0Ywg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAgc2hpZnRYL3NoaWZ0WVxuICAgICAgICAkY3RybC5fZWxlbSA9ICRjdHJsLmRyYWdUYXJnZXQuZHJhZ0VsZW1lbnRbMF07XG4gICAgICAgICRjdHJsLl9tYXJnaW4gPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKCRjdHJsLl9lbGVtLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdtYXJnaW4nKSk7XG5cbiAgICAgICAgbGV0IGNvb3JkcyA9IGdlb21ldHJ5U2VydmljZS5nZXRDb29yZHMoJGN0cmwuX2VsZW0pO1xuICAgICAgICAkY3RybC5fc2hpZnRYID0gJGN0cmwuZHJhZ1RhcmdldC5zdGFydFggLSBjb29yZHMubGVmdDtcbiAgICAgICAgJGN0cmwuX3NoaWZ0WSA9ICRjdHJsLmRyYWdUYXJnZXQuc3RhcnRZIC0gY29vcmRzLnRvcDtcblxuICAgICAgICAkY3RybC5vbGQgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6ICRjdHJsLl9lbGVtLnBhcmVudE5vZGUsXG4gICAgICAgICAgICBuZXh0U2libGluZzogJGN0cmwuX2VsZW0ubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJGN0cmwuX2VsZW0uc3R5bGUucG9zaXRpb24gfHwgJycsXG4gICAgICAgICAgICBsZWZ0OiBjb29yZHMubGVmdCB8fCAnJyxcbiAgICAgICAgICAgIHRvcDogY29vcmRzLnRvcCB8fCAnJyxcbiAgICAgICAgICAgIHpJbmRleDogJGN0cmwuX2VsZW0uc3R5bGUuekluZGV4IHx8ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgkY3RybC5fZWxlbSk7XG4gICAgICAgICRjdHJsLl9lbGVtLnN0eWxlLnpJbmRleCA9IDIwO1xuICAgICAgICAkY3RybC5fZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBNb3ZlIGVsZW1lbnQgZm9sbG93aW5nIHRoZSBjdXJzb3JcbiAgICAqXG4gICAgKiovXG4gICAgZnVuY3Rpb24gb25EcmFnTW92ZShldmVudCkge1xuXG4gICAgICAgICRjdHJsLl9lbGVtWCA9IGV2ZW50LnBhZ2VYIC0gJGN0cmwuX3NoaWZ0WDtcbiAgICAgICAgJGN0cmwuX2VsZW1ZID0gZXZlbnQucGFnZVkgLSAkY3RybC5fc2hpZnRZO1xuXG4gICAgICAgICRjdHJsLl9lbGVtLnN0eWxlLmxlZnQgPSAkY3RybC5fZWxlbVhcbiAgICAgICAgICAgIC0gJGN0cmwuX21hcmdpblxuICAgICAgICAgICAgKyAncHgnO1xuICAgICAgICAkY3RybC5fZWxlbS5zdHlsZS50b3AgPSAkY3RybC5fZWxlbVlcbiAgICAgICAgICAgIC0gJGN0cmwuX21hcmdpblxuICAgICAgICAgICAgKyAncHgnO1xuXG4gICAgICAgICRjdHJsLl9jdXJyZW50VGFyZ2V0RWxlbSA9IGdlb21ldHJ5U2VydmljZS5nZXRFbGVtZW50VW5kZXJDbGllbnRYWSgkY3RybC5fZWxlbSwgZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBGaW5kIGRyb3Agem9uZVxuICAgICpcbiAgICAqKi9cbiAgICBmdW5jdGlvbiBmaW5kRHJvcFRhcmdldCgpIHtcbiAgICAgICAgaWYgKCEkY3RybC5fY3VycmVudFRhcmdldEVsZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVsZW0gPSAkY3RybC5fY3VycmVudFRhcmdldEVsZW07XG5cbiAgICAgICAgd2hpbGUgKGVsZW0gIT0gZG9jdW1lbnQgJiYgZWxlbS5tb2RlICE9PSAnZHJvcCcgJiYgZWxlbS5tb2RlICE9PSAndHJhc2gnKSB7XG4gICAgICAgICAgICBlbGVtID0gZWxlbS5wYXJlbnROb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsZW0gPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21tb24nKVxuICAgIC5maWx0ZXIoJ3NlYXJjaEZpbHRlcicsIHNlYXJjaEZpbHRlcik7XG5cbmZ1bmN0aW9uIHNlYXJjaEZpbHRlcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW1zLCBzZWFyY2hXb3JkLCBjdXJGaWVsZHMsIGluc2VucywgZXhhY3QpIHtjb25zb2xlLmxvZyhjdXJGaWVsZHMpO1xuICAgICAgICByZXR1cm4gaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAgICAgICAgIGxldCBzd0VzY2FwZWQgPSBzZWFyY2hXb3JkLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICAgICAgICAgIGxldCByZWdleCA9IG5ldyBSZWdFeHAoZXhhY3Q/ICdeJytzd0VzY2FwZWQrJyQnOiBzd0VzY2FwZWQsIGluc2Vucz8gJ2knOiAnJyk7XG5cbiAgICAgICAgICAgIGlmICghYW5ndWxhci5lcXVhbHMoe05hbWU6IGZhbHNlLCBUeXBlOiBmYWxzZSwgJ0Rlc2lnbmVkIGJ5JzogZmFsc2V9LCBjdXJGaWVsZHMpKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgZmllbGQgaW4gY3VyRmllbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJGaWVsZHNbZmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2gocmVnZXgudGVzdChpdGVtW2ZpZWxkXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXMuc29tZShmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoID09PSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVnZXgudGVzdChpdGVtLk5hbWUpIHx8IHJlZ2V4LnRlc3QoaXRlbS5UeXBlKSB8fCByZWdleC50ZXN0KGl0ZW1bJ0Rlc2lnbmVkIGJ5J10pO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21tb24nKVxuICAgIC5jb21wb25lbnQoJ3Bhc3N3b3JkQ29uZmlybScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2NvbW1vbi9wYXNzd29yZC1jb25maXJtL3Bhc3N3b3JkLWNvbmZpcm0uY29tcG9uZW50LnRtcGwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IHBhc3N3b3JkQ29uZmlybUNvbnRyb2xsZXIsXG4gICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICBwYXNzd29yZDogJzwnXG4gICAgICAgIH1cbiAgICB9KTtcblxuZnVuY3Rpb24gcGFzc3dvcmRDb25maXJtQ29udHJvbGxlcigpIHtcbiAgICB2YXIgJGN0cmwgPSB0aGlzO1xuXG4gICAgJGN0cmwuJG9uQ2hhbmdlcyA9IGNoZWNrO1xuXG4gICAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgICAgIGlmICghJGN0cmwucGFzc3dvcmRDb25maXJtRm9ybSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJGN0cmwucGFzc3dvcmRDb25maXJtRm9ybS5uZXdwYXNzd29yZHJlcGVhdC4kc2V0VmFsaWRpdHkoJ21hdGNoJywgJGN0cmwucGFzc3dvcmQgPT09ICRjdHJsLnBhc3N3b3JkQ29uZmlybSk7XG4gICAgfVxufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgncHdkRGlyJywgcHdkRGlyKTtcblxuZnVuY3Rpb24gcHdkRGlyKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuXG4gICAgICAgICAgICBsZXQgbWUgPSBhdHRycy5uZ01vZGVsO1xuICAgICAgICAgICAgbGV0IG1hdGNoVG8gPSBhdHRycy5wd2REaXI7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaEdyb3VwKFttZSwgbWF0Y2hUb10sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3RybC4kc2V0VmFsaWRpdHkoJ3B3ZG1hdGNoJywgdmFsdWVbMF0gPT09IHZhbHVlWzFdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21tb24nKVxuICAgIC5jb21wb25lbnQoJ25hdkJhcicsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2NvbW1vbi9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRtcGwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IE5hdmJhckNvbnRyb2xsZXIsXG4gICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICBsb2NhdGlvbjogJzwnXG4gICAgICAgIH1cbiAgICB9KTtcblxuTmF2YmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc3RhdGUnLCAnZ2xvYmFsVmFycycsICdhdXRoU2VydmljZScsICckY29va2llcyddO1xuXG5mdW5jdGlvbiBOYXZiYXJDb250cm9sbGVyKCRzdGF0ZSwgZ2xvYmFsVmFycywgYXV0aFNlcnZpY2UsICRjb29raWVzKSB7XG4gICAgdmFyICRjdHJsID0gdGhpcztcblxuICAgICRjdHJsLnN0YXRlcyA9ICRzdGF0ZS5nZXQoKS5maWx0ZXIoc3RhdGUgPT4gIXN0YXRlLmFic3RyYWN0KTtcbiAgICAkY3RybC5pc0FjdGl2ZSA9IGlzQWN0aXZlO1xuICAgICRjdHJsLmdvVG8gPSBnb1RvO1xuICAgICRjdHJsLmdsb2JhbFZhcnMgPSBnbG9iYWxWYXJzLmRhdGE7XG5cbiAgICBmdW5jdGlvbiBnb1RvKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiAkc3RhdGUuZ28oc3RhdGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWN0aXZlKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiAkc3RhdGUuaW5jbHVkZXMoc3RhdGUpO1xuICAgIH1cblxuICAgICRjdHJsLmxvZ291dCA9IGxvZ291dDtcblxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgICAgYXV0aFNlcnZpY2UubG9nb3V0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UuZGF0YS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRjb29raWVzKTtcbiAgICAgICAgICAgICAgICBnbG9iYWxWYXJzLnNldFZhcignbG9nZ2VkSW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZ29UbyhcImFwcC5sb2dpblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tbW9uJylcbiAgICAuY29tcG9uZW50KCdyZXNpemFibGUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6IFJlc2l6YWJsZUNvbnRyb2xsZXJcbiAgICB9KTtcblxuUmVzaXphYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckZWxlbWVudCcsICckZG9jdW1lbnQnLCAnZ2VvbWV0cnlTZXJ2aWNlJ107XG5cbi8qKlxuICogUmVzaXplIGNvbnRyb2xsZXJcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUmVzaXphYmxlQ29udHJvbGxlcigkZWxlbWVudCwgJGRvY3VtZW50LCBnZW9tZXRyeVNlcnZpY2UpIHtcbiAgICB2YXIgJGN0cmwgPSB0aGlzO1xuXG4gICAgJGN0cmwuJHBvc3RMaW5rID0gaW5pdDtcbiAgICAkY3RybC5hY3RpdmUgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICRjdHJsLl9lbGVtID0gJGVsZW1lbnQuY2hpbGRyZW4oKVswXTtcbiAgICAgICAgJGN0cmwuJGVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoJGN0cmwuX2VsZW0pO1xuXG4gICAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHNob3dDb250cm9scyhlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGVsZW1lbnQub24oJ21vdXNlbGVhdmUgbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJlbW92ZUNvbnRyb2xzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmICghJGN0cmwuYWN0aXZlIHx8ICEkY3RybC5fZWxlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNzcyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogZS5wYWdlWCArICRjdHJsLnN0V2lkdGggLSAkY3RybC5jb3JuZXJTWCArICdweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBlLnBhZ2VZICsgJGN0cmwuc3RIZWlnaHQgLSAkY3RybC5jb3JuZXJTWSArICdweCdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRjdHJsLiRlbGVtLmNzcyhjc3MpO1xuICAgICAgICAgICAgJGVsZW1lbnQuY3NzKGNzcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignbW91c2V1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZW1vdmVDb250cm9scygpO1xuICAgICAgICAgICAgJGN0cmwuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXHQvKipcbiAgICAgKiBTaG93IHJlc2l6ZSBjb250cm9sc1xuICAgICAqXG4gICAgICogQHBhcmFtIGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaG93Q29udHJvbHMoZSkge1xuXG4gICAgICAgIGxldCBvdmVybGF5RWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdiBjbGFzcz1cInJlc2l6ZS1jb250cm9sXCIgZGF0YS1tb2RlPVwicmVzaXplLWNvcm5lclwiPjwvZGl2PicpO1xuXG4gICAgICAgIG92ZXJsYXlFbGVtZW50Lm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICRjdHJsLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGdlb21ldHJ5U2VydmljZS5nZXRDb29yZHMoJGN0cmwuX2VsZW0pO1xuXG4gICAgICAgICAgICAkY3RybC5zdFdpZHRoID0gcG9zaXRpb24ud2lkdGg7XG4gICAgICAgICAgICAkY3RybC5zdEhlaWdodCA9IHBvc2l0aW9uLmhlaWdodDtcblxuICAgICAgICAgICAgJGN0cmwuY29ybmVyU1ggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgICRjdHJsLmNvcm5lclNZID0gZXZlbnQucGFnZVk7XG5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZWxlbWVudC5hcHBlbmQob3ZlcmxheUVsZW1lbnQpO1xuXG4gICAgfVxuXG5cdC8qKlxuICAgICAqXG4gICAgICogUmVtb3ZlIHJlc2l6ZSBjb250cm9sc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZUNvbnRyb2xzKCkge1xuICAgICAgICBsZXQgcmVzaXplRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyZXNpemUtY29udHJvbCcpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQocmVzaXplRWxlbWVudHMpLnJlbW92ZSgpO1xuICAgIH1cblxufVxuIiwiLyoqXG4gKiBTZWxlY3Qgd2l0aCBzZWFyY2ggZnVuY3Rpb25hbGl0eVxuICovXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tbW9uJylcbiAgICAuY29tcG9uZW50KCdzZWxlY3RJbXByb3ZlZCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2NvbW1vbi9zZWxlY3QtaW1wcm92ZWQvc2VsZWN0LWltcHJvdmVkLmNvbXBvbmVudC50bXBsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBTZWxlY3RJbXByb3ZlZENvbnRyb2xsZXIsXG4gICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICBzZWx2YWx1ZTogJ0AnLFxuICAgICAgICAgICAgbGlzdDogJzwnXG4gICAgICAgIH1cbiAgICB9KTtcblxuU2VsZWN0SW1wcm92ZWRDb250cm9sbGVyLiRpbmplY3QgPSBbJ2dsb2JhbFZhcnMnLCAnJHNjb3BlJ107XG5cbi8qKlxuICogU2VsZWN0IGltcHJvdmVkIGNvbnRyb2xsZXJcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gU2VsZWN0SW1wcm92ZWRDb250cm9sbGVyKGdsb2JhbFZhcnMsICRzY29wZSkge1xuICAgIHZhciAkY3RybCA9IHRoaXM7XG5cbiAgICBsZXQgdGhlbWVzID0gW1xuICAgICAgICB7bmFtZTogJ3ByaW1hcnknLCB2YWw6ICdEYXJrIGJsdWUnfSxcbiAgICAgICAge25hbWU6ICdzdWNjZXNzJywgdmFsOiAnR3JlZW4nfSxcbiAgICAgICAge25hbWU6ICdpbmZvJywgdmFsOiAnQmx1ZSd9LFxuICAgICAgICB7bmFtZTogJ3dhcm5pbmcnLCB2YWw6J1llbGxvdyd9LFxuICAgICAgICB7bmFtZTogJ2RhbmdlcicsIHZhbDogJ1JlZCd9LFxuICAgICAgICB7bmFtZTogJ2dyZXknLCB2YWw6ICdHcmV5J30sXG4gICAgICAgIHtuYW1lOiAnY29kZWl0JywgdmFsOidDb2RlSVQnfSxcbiAgICAgICAge25hbWU6ICdkYXJrLXJlZCcsIHZhbDogJ0RhcmsgcmVkJ31cbiAgICBdO1xuXG4gICAgJGN0cmwuZXhwYW5kID0gZmFsc2U7XG4gICAgJGN0cmwuJHBvc3RMaW5rID0gaW5pdDtcbiAgICAkY3RybC5oaWRlID0gaGlkZTtcbiAgICAkY3RybC5zZXRWYWwgPSBzZXRWYWw7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBpZiAoISRjdHJsLmxpc3QpIHtcbiAgICAgICAgICAkY3RybC5saXN0ID0gdGhlbWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgJGN0cmwuY3VycmVudCA9IGdsb2JhbFZhcnMuZ2V0VmFyKCRjdHJsLnNlbHZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlKCkge1xuICAgICAgICAkY3RybC5leHBhbmQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VmFsKHZhbCkge1xuICAgICAgICAkY3RybC5jdXJyZW50ID0gdmFsO1xuICAgICAgICBnbG9iYWxWYXJzLnNldFZhcigkY3RybC5zZWx2YWx1ZSwgdmFsKTtcbiAgICB9XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbW1vbicpXG4gICAgLnNlcnZpY2UoJ2dlb21ldHJ5U2VydmljZScsIGdlb21ldHJ5U2VydmljZSk7XG5cbmZ1bmN0aW9uIGdlb21ldHJ5U2VydmljZSgpIHtcblxuICAgIHRoaXMuZ2V0Q29vcmRzID0gZ2V0Q29vcmRzO1xuICAgIHRoaXMuZ2V0RWxlbWVudFVuZGVyQ2xpZW50WFkgPSBnZXRFbGVtZW50VW5kZXJDbGllbnRYWTtcblxuICAgIC8qKlxuICAgICogR2V0IGdlb21ldHJ5IHZhbHVlcyBvZiB0aGUgZWxlbWVudFxuICAgICpcbiAgICAqKi9cbiAgICBmdW5jdGlvbiBnZXRDb29yZHMoZWxlbSkge1xuICAgICAgICBsZXQgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIGxldCBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcDtcbiAgICAgICAgbGV0IHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnQ7XG5cbiAgICAgICAgbGV0IGNsaWVudFRvcCA9IGRvY0VsLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwO1xuICAgICAgICBsZXQgY2xpZW50TGVmdCA9IGRvY0VsLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDA7XG5cbiAgICAgICAgbGV0IHRvcCAgPSBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wO1xuICAgICAgICBsZXQgbGVmdCA9IGJveC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnQ7XG4gICAgICAgIGxldCByaWdodCA9IGJveC5yaWdodCArIHNjcm9sbExlZnQgLSBjbGllbnRMZWZ0O1xuICAgICAgICBsZXQgYm90dG9tID0gYm94LmJvdHRvbSArIHNjcm9sbFRvcCAtIGNsaWVudFRvcDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHRvcCksXG4gICAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKGxlZnQpLFxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgucm91bmQocmlnaHQpLFxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLnJvdW5kKGJvdHRvbSksXG4gICAgICAgICAgICB3aWR0aDogYm94LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBib3guaGVpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBGaW5kIHRhcmdldCB1bmRlciBjdXJzb3JcbiAgICAqXG4gICAgKiovXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudFVuZGVyQ2xpZW50WFkoZWxlbSwgY2xpZW50WCwgY2xpZW50WSkge1xuICAgICAgICBsZXQgZGlzcGxheSA9IGVsZW0uc3R5bGUuZGlzcGxheSB8fCAnJztcbiAgICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpO1xuXG4gICAgICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICAgICAgaWYgKCF0YXJnZXQgfHwgdGFyZ2V0ID09IGRvY3VtZW50KSB7IC8vINGN0YLQviDQsdGL0LLQsNC10YIg0L/RgNC4INCy0YvQvdC+0YHQtSDQt9CwINCz0YDQsNC90LjRhtGLINC+0LrQvdCwXG4gICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbW1vbicpXG4gICAgLnNlcnZpY2UoJ2dsb2JhbFZhcnMnLCBnbG9iYWxWYXJzKTtcblxuZnVuY3Rpb24gZ2xvYmFsVmFycygpIHtcblxuICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgIGxldCB2YXJzID0ge307XG5cbiAgICBzZWxmLmdldFZhciA9IGdldFZhcjtcbiAgICBzZWxmLnNldFZhciA9IHNldFZhcjtcbiAgICBzZWxmLmRhdGEgPSB2YXJzO1xuXG4gICAgZnVuY3Rpb24gc2V0VmFyKGtleSwgaXRlbSkge1xuICAgICAgICB2YXJzW2tleV0gPSBpdGVtO1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWYXIoa2V5KSB7XG4gICAgICAgIHJldHVybiB2YXJzW2tleV0gIT09IHVuZGVmaW5lZCA/IHZhcnNba2V5XTogbnVsbDtcbiAgICB9XG5cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tbW9uJylcbiAgICAuc2VydmljZSgnc3RvcmFnZVNlcnZpY2UnLCBzdG9yYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIHN0b3JhZ2VTZXJ2aWNlKCkge1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5nZXRMb2NhbCA9IGdldExvY2FsO1xuICAgIHNlbGYuc2V0TG9jYWwgPSBzZXRMb2NhbDtcblxuICAgIGZ1bmN0aW9uIGdldExvY2FsKGtleSkge1xuICAgICAgICBsZXQgaXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIHJldHVybiAoaXRlbSA/IEpTT04ucGFyc2UoaXRlbSkgOiBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRMb2NhbChrZXksIGl0ZW0pIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShpdGVtKSk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAudHJhbnNsYXRpb25zJylcbiAgICAuc2VydmljZSgndHJhbnNsYXRpb25TZXJ2aWNlJywgdHJhbnNsYXRpb25TZXJ2aWNlKTtcblxudHJhbnNsYXRpb25TZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJywgJ3N0b3JhZ2VTZXJ2aWNlJ107XG5mdW5jdGlvbiB0cmFuc2xhdGlvblNlcnZpY2UoJGh0dHAsICRxLCBzdG9yYWdlU2VydmljZSkge1xuXG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogJ2h0dHA6Ly9kY29kZWl0Lm5ldC9hbmd1bGFyVGVzdC90cmFuc2xhdGlvbi5waHAnXG4gICAgfTtcblxuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmdldExhbmdzID0gZ2V0TGFuZ3M7XG4gICAgc2VsZi5sb2FkID0gbG9hZDtcblxuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHNlbGYsIHN0b3JhZ2VTZXJ2aWNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkKHNlbGVjdGVkTGFuZykge1xuICAgICAgICBvcHRpb25zLnBhcmFtcyA9IHtsYW5nIDogc2VsZWN0ZWRMYW5nfTtcblxuICAgICAgICByZXR1cm4gJGh0dHAob3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0TG9jYWwoc2VsZWN0ZWRMYW5nLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMYW5ncygpIHtcbiAgICAgICAgbGV0IGxhbmdzID0gWydlbmcnLCAncnVzJywgJ2RlJywgJ25vJywgJ2l0JywgJ3N2J107XG5cbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHJlc29sdmUobGFuZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
