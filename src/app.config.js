angular.module('testApp').config(['$routeProvider', function config($routeProvider) {
    $routeProvider.when('/users', {
        template: '<user-list></user-list>'
    }).when('/users/:userId', {
        template: '<user-detail></user-detail>'
    }).when('/addUser', {
        template: '<user-add></user-add>'
    }).otherwise('/users');
}]);