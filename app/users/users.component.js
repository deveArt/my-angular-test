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
