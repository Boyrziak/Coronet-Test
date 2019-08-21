angular.module('userAdd').component('userAdd', {
   templateUrl: 'user-add/user-add.template.html',
    controller: ['$http', '$routeParams', function UserAddController($http, $routeParams){
       let self = this;
       this.user = {
           name: '',
           password: ''
       };

       this.addUser = function addUser() {
           if (self.user.name.length > 0 && self.user.password > 0) {
               $http.get('http://localhost:1603/addUser?name=' + self.user.name + '&password=' + self.user.password).then((response) => {
                   console.log(response);
               });
           }
       }
    }]
});