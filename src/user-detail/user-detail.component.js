angular.module('userDetail').component('userDetail', {
   templateUrl: 'user-detail/user-detail.template.html',
    controller: ['$http', '$routeParams', function UserDetailController($http, $routeParams){
       let self = this;
       this.edit = $routeParams.edit;

       $http.get('http://localhost:1603/getUser?userId=' + $routeParams.userId).then((response)=>{
           self.user = response.data;
       });

       this.editUser = function editUser() {
           console.log(self.user);
           $http.get('http://localhost:1603/updateUser?id=' + $routeParams.userId + '&name=' + self.user.name + '&password=' + self.user.password).then((response)=>{
                console.log(response);
               let socket = io('http://localhost:3000');
               socket.emit('update');
           });
       }
    }]
});