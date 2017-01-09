angular
    .module('app')
    .controller('usersCtrl', UsersController);

UsersController.$inject = ['storageSvc', '$routeParams'];
function UsersController(storageSvc, $routeParams) {

    var defaultUsers = [
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

    var vm = this;
    vm.data = {};
    vm.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;
    vm.submit = submit;
    vm.userId = null;

    init();
    
    function init() {
        vm.users = storageSvc.getLocal('users');
        if (!vm.users) {
            storageSvc.setLocal('users', defaultUsers);
            vm.users = defaultUsers;
        }

        if ($routeParams.id) {
            vm.userId = $routeParams.id;
            vm.data = angular.copy(vm.users[$routeParams.id]);
        }
    }

    function submit(userId) {
        if (userId) {
            edit(userId);
        } else {
            add();
        }
        storageSvc.setLocal('users', vm.users);
    }

    function add() {
        vm.users.push(vm.data);
        vm.data = {};
        vm.usersForm.$setPristine();
    }

    function edit(userId) {
        vm.users[userId] = angular.copy(vm.data);
    }
}
